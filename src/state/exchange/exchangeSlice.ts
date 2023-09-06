import _ from "lodash";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ExchangeStateType, TransactionType } from "./types";
import { TokensStateType } from "../tokens/types";

import { buildGraphData, decorateOrder, decorateOrderBookOrders } from "~/utils";

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
	events: [],
} as ExchangeStateType;

const exchangeSlice = createSlice({
	name: "exchange",
	initialState,
	reducers: {
		exchangeBalancesLoaded: (state, action: PayloadAction<ExchangeStateType>) => {
			const { token1Balance, token2Balance } = action.payload;

			state.balances.token1 = token1Balance;
			state.balances.token2 = token2Balance;

			state.loaded = true;
		},

		transferRequested: (state) => {
			state.transaction = {
				transactionType: TransactionType.TRANSFER,
				isPending: true,
				isSuccessful: false,
			};

			state.transferInProgress = true;
		},

		transferFailed: (state) => {
			state.transaction = {
				transactionType: TransactionType.TRANSFER,
				isPending: false,
				isSuccessful: false,
				hasError: true,
			};

			state.transferInProgress = false;
		},

		transferSuccess: (state) => {
			state.transaction = {
				transactionType: TransactionType.TRANSFER,
				isPending: false,
				isSuccessful: true,
			};

			state.transferInProgress = false;
			// state.events = events; // non-serialized value
		},

		// ORDERS
		makeOrderRequested: (state) => {
			state.transaction = {
				transactionType: TransactionType.MAKE_ORDER,
				isPending: true,
				isSuccessful: false,
			};

			state.orderInProgress = true;
		},

		makeOrderFailed: (state) => {
			state.transaction = {
				transactionType: TransactionType.MAKE_ORDER,
				isPending: false,
				isSuccessful: false,
				hasError: true,
			};

			state.orderInProgress = false;
		},

		makeOrderSuccess: (state) => {
			state.transaction = {
				transactionType: TransactionType.MAKE_ORDER,
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
			};
		},

		canceledOrdersLoaded: (state, action) => {
			const canceledOrders = action.payload;

			state.orders = {
				...state.orders,
				canceledOrders,
			};
		},

		filledOrdersLoaded: (state, action) => {
			const filledOrders = action.payload;

			state.orders = {
				...state.orders,
				filledOrders,
			};
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
	const allOpenOrders = _.reject(all, (order) => {
		const isOrderFilled = filled.some((o) => o.id.toString() === order.id.toString());
		const isOrderCanceled = canceled.some((o) => o.id.toString() === order.id.toString());

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
	orders = orders.filter((o) => o.tokenGet === tokens.token1.address || o.tokenGet === tokens.token2.address);
	orders = orders.filter((o) => o.tokenGive === tokens.token1.address || o.tokenGive === tokens.token2.address);

	// decorate the orders (basically add more details about the orders)
	orders = decorateOrderBookOrders(orders, tokens);

	// group orders by 'orderType' property whether it's a BUY order or a SELL order
	orders = _.groupBy(orders, "orderType");

	// sort BUY orders by token price
	const buyOrders = _.get(orders, "BUY", []);
	orders = { ...orders, BUY: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice) };

	// sort SELL orders by token price
	const sellOrders = _.get(orders, "SELL", []);
	orders = { ...orders, SELL: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice) };

	return orders;
});

// this selector returns all the graph data that we need to show on the candlestick chart (graph data - series)
export const selectGraphDataForPriceChart = createSelector([selectFilledOrders, selectTokens], (orders, tokens: TokensStateType) => {
	if (!tokens.token1 || !tokens.token2) {
		return;
	}

	// filter orders by selected token pairs
	orders = orders.filter((o) => o.tokenGet === tokens.token1.address || o.tokenGet === tokens.token2.address);
	orders = orders.filter((o) => o.tokenGive === tokens.token1.address || o.tokenGive === tokens.token2.address);

	// Sort the orders by date
	orders = orders.sort((a, b) => a.timestamp - b.timestamp);

	// decorate the orders (basically add more details about the orders)
	orders = orders.map((order) => decorateOrder(order, tokens));

	return {
		series: [{ data: buildGraphData(orders) }],
	};
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
