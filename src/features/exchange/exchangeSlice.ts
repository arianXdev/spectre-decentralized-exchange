import _ from "lodash";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ExchangeStateType, TransactionType } from "./types";
import { TokensStateType } from "../tokens/types";

import { decorateOrder } from "~/utils";

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
export const orderBookSelector = createSelector(allOrders, tokens, (orders, { token1, token2 }: TokensStateType) => {
	if (!token1 || !token2) return;

	// filter orders by selected token pairs
	orders = orders.filter((order) => order.tokenGet === token1.address || order.tokenGet === token2.address);
	orders = orders.filter((order) => order.tokenGive === token1.address || order.tokenGive === token2.address);

	// decorate the orders (basically add more details about the orders)
	orders.map((order: object) => {
		let decoratedOrder = decorateOrder(order, tokens);
		console.log(decoratedOrder);
	});
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
