import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import _ from "lodash";

import { ExchangeStateType, OrdersType, OrderType, TRANSACTION_TYPE } from "./types";

import { buildGraphData, decorateOrder, decorateOrderBookOrders, decorateFilledOrders } from "~/utils";
import { TokensStateType } from "../tokens/types";

const initialState = {
	loaded: false,
	balances: {
		token1: "0.00",
		token2: "0.00",
	},
	orders: {
		loaded: false,
		allOrders: [],
		canceledOrders: [],
		filledOrders: [],
	},
	transferInProgress: false,
	orderInProgress: false,
	events: [] as Array<ethers.ContractEvent>,
} as ExchangeStateType;

const exchangeSlice = createSlice({
	name: "exchange",
	initialState,
	reducers: {
		exchangeBalancesLoaded: {
			reducer: (state, action: PayloadAction<ExchangeStateType>) => {
				const tokensBalances = action.payload;

				state.balances.token1 = tokensBalances.token1;
				state.balances.token2 = tokensBalances.token2;

				state.loaded = true;
			},

			prepare: (token1Balance, token2Balance): any => {
				return {
					payload: {
						token1: token1Balance,
						token2: token2Balance,
					},
				};
			},
		},

		transferRequested: (state) => {
			state.transaction = {
				transactionType: TRANSACTION_TYPE.TRANSFER,
				isPending: true,
				isSuccessful: false,
			};

			state.transferInProgress = true;
		},

		transferFailed: (state) => {
			state.transaction = {
				transactionType: TRANSACTION_TYPE.TRANSFER,
				isPending: false,
				isSuccessful: false,
				hasError: true,
			};

			state.transferInProgress = false;
		},

		transferSuccess: (state) => {
			state.transaction = {
				transactionType: TRANSACTION_TYPE.TRANSFER,
				isPending: false,
				isSuccessful: true,
			};

			state.transferInProgress = false;
			// state.events = events; // non-serialized value
		},

		// ORDERS
		makeOrderRequested: (state) => {
			state.transaction = {
				transactionType: TRANSACTION_TYPE.MAKE_ORDER,
				isPending: true,
				isSuccessful: false,
			};

			state.orderInProgress = true;
		},

		makeOrderFailed: (state) => {
			state.transaction = {
				transactionType: TRANSACTION_TYPE.MAKE_ORDER,
				isPending: false,
				isSuccessful: false,
				hasError: true,
			};

			state.orderInProgress = false;
		},

		makeOrderSuccess: (state) => {
			state.transaction = {
				transactionType: TRANSACTION_TYPE.MAKE_ORDER,
				isPending: false,
				isSuccessful: true,
			};

			state.orderInProgress = false;
			// state.events = events; // non-serialized value
		},

		allOrdersLoaded: (state, action) => {
			const allOrders = action.payload;

			state.orders = {
				...state.orders,
				loaded: true,
				allOrders,
			} as OrdersType;
		},

		canceledOrdersLoaded: (state, action) => {
			const canceledOrders = action.payload;

			state.orders = {
				...state.orders,
				canceledOrders,
			} as OrdersType;
		},

		filledOrdersLoaded: (state, action) => {
			const filledOrders = action.payload;

			state.orders = {
				...state.orders,
				filledOrders,
			} as OrdersType;
		},
	},
});

// ----------------------------
// --------- Selectors --------
// ----------------------------

const selectTokens = (state: TokensStateType) => _.get(state, "tokens", []);

const selectAllOrders = (state: ExchangeStateType) => _.get(state, "exchange.orders.allOrders", []);
const selectFilledOrders = (state: ExchangeStateType) => _.get(state, "exchange.orders.filledOrders", []);
const selectCanceledOrders = (state: ExchangeStateType) => _.get(state, "exchange.orders.canceledOrders", []);

// Note: All Orders - (Filled Orders + Canceled Orders) = Open Orders
const selectOpenOrders = (state: ExchangeStateType) => {
	const all = selectAllOrders(state);
	const filled = selectFilledOrders(state);
	const canceled = selectCanceledOrders(state);

	// make filled and canceled orders separated from all the orders - so we can get all the open orders eventually
	const allOpenOrders = _.reject(all, (order: OrderType) => {
		const isOrderFilled = filled.some((o: OrderType) => o.id.toString() === order.id.toString());
		const isOrderCanceled = canceled.some((o: OrderType) => o.id.toString() === order.id.toString());

		return isOrderFilled || isOrderCanceled;
	});

	return allOpenOrders;
};

// ----------------------------
// ---- Memoized Selectors ----
// ----------------------------

/* REDUX NOTE:
	- Memoized selectors will only recalculate the results if the input selectors return new values
 	- Whatever those input selectors return becomes the arguments for the output selector.
*/

// this selector returns all the orders that we need to display on the Order Book
export const selectOrdersForOrderBook = createSelector([selectOpenOrders, selectTokens], (orders, tokens: TokensStateType) => {
	if (!tokens.token1 || !tokens.token2) {
		return;
	}

	// filter orders by selected token pairs
	orders = orders.filter((o: OrderType) => o.tokenGet === tokens.token1?.address || o.tokenGet === tokens.token2?.address);
	orders = orders.filter((o: OrderType) => o.tokenGive === tokens.token1?.address || o.tokenGive === tokens.token2?.address);

	// decorate the orders (basically add more details about the orders)
	orders = decorateOrderBookOrders(orders, tokens);

	// group orders by 'orderType' property whether it's a BUY order or a SELL order
	orders = _.groupBy(orders, "orderType");

	// sort BUY orders by token price
	const buyOrders = _.get(orders, "BUY", []);
	orders = { ...orders, BUY: buyOrders.sort((a: OrderType, b: OrderType) => b.tokenPrice - a.tokenPrice) };

	// sort SELL orders by token price
	const sellOrders = _.get(orders, "SELL", []);
	orders = { ...orders, SELL: sellOrders.sort((a: OrderType, b: OrderType) => b.tokenPrice - a.tokenPrice) };

	return orders;
});

// this selector returns all the graph data that we need to show on the candlestick chart (graph data - series)
export const selectGraphDataForPriceChart = createSelector([selectFilledOrders, selectTokens], (orders, tokens: TokensStateType) => {
	if (!tokens.token1 || !tokens.token2) {
		return;
	}

	// filter orders by selected token pairs
	orders = orders.filter((o: OrderType) => o.tokenGet === tokens.token1?.address || o.tokenGet === tokens.token2?.address);
	orders = orders.filter((o: OrderType) => o.tokenGive === tokens.token1?.address || o.tokenGive === tokens.token2?.address);

	// Sort the orders by date
	orders = orders.sort((a: OrderType, b: OrderType) => a.timestamp - b.timestamp);

	// decorate the orders (basically add more details about the orders)
	orders = orders.map((order: OrderType) => decorateOrder(order, tokens));

	return {
		series: [{ data: buildGraphData(orders) }],
	};
});

// this selector returns all the filled orders / trades (filled orders means trades) so that we can use to display in our UI
export const selectTrades = createSelector([selectFilledOrders, selectTokens], (orders, tokens: TokensStateType) => {
	// if the tokens don't exist, break and stop
	if (!tokens.token1 || !tokens.token2) {
		return;
	}

	// filter orders by selected token pairs
	orders = orders.filter((o: OrderType) => o.tokenGet === tokens.token1?.address || o.tokenGet === tokens.token2?.address);
	orders = orders.filter((o: OrderType) => o.tokenGive === tokens.token1?.address || o.tokenGive === tokens.token2?.address);

	// sort the filled orders (trades) by time ascending for price comparison
	orders = orders.sort((a: OrderType, b: OrderType) => a.timestamp - b.timestamp);

	// decorate the filled orders
	orders = decorateFilledOrders(orders, tokens);

	// sort the filled orders (trades) by time descending for rendering in the UI
	orders = orders.sort((a: OrderType, b: OrderType) => b.timestamp - a.timestamp);

	return orders;
});

// export action creators
export const {
	exchangeBalancesLoaded,
	transferRequested,
	transferSuccess,
	transferFailed,
	makeOrderRequested,
	makeOrderFailed,
	makeOrderSuccess,
	allOrdersLoaded,
	filledOrdersLoaded,
	canceledOrdersLoaded,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
