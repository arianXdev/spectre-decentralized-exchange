import _ from "lodash";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ExchangeStateType, TransactionType } from "./types";
import { TokensStateType } from "../tokens/types";

import { decorateOrderBookOrders } from "~/utils/decorateOrderBook";

const initialState = {
	loaded: false,
	balances: {
		token1: "0.00",
		token2: "0.00",
	},
	orders: {
		loaded: false,
		allOrders: [],
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
				loaded: true,
				allOrders,
			};
		},
	},
});

// Input Selectors
const allOrders = (state: ExchangeStateType) => _.get(state, "exchange.orders.allOrders", []);
const tokens = (state: TokensStateType) => _.get(state, "tokens", []);

// Selectors
export const orderBookSelector = createSelector(allOrders, tokens, (orders, tokens: TokensStateType) => {
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

export const {
	exchangeBalancesLoaded,
	transferRequested,
	transferSuccess,
	transferFailed,
	makeOrderRequested,
	makeOrderFailed,
	makeOrderSuccess,
	allOrdersLoaded,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
