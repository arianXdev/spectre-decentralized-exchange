import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { produce } from "immer";

// Define a type for the slice state
interface ExchangeState {
	loaded: boolean;
	balances: { token1: string; token2: string };
	orders?: { loaded: boolean; allOrders: unknown[] | object };
	transaction: { transactionType: TransactionType; isPending: boolean; isSuccessful: boolean; hasError?: boolean };
	transferInProgress: boolean;
	orderInProgress: boolean;
	events?: [];
}

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
} as ExchangeState;

enum TransactionType {
	TRANSFER = "TRANSFER",
	MAKE_ORDER = "MAKE ORDER",
	FILL_ORDER = "FILL ORDER",
	CANCEL_ORDER = "CANCEL ORDER",
}

const exchangeSlice = createSlice({
	name: "exchange",
	initialState,
	reducers: {
		exchangeBalancesLoaded: (state, action: PayloadAction<ExchangeState>) => {
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

		makeOrderSuccess: (state, action: PayloadAction<ExchangeState>) => {
			const order = action.payload;

			state.orders = {
				loaded: true,
				allOrders: [...state.orders?.allOrders, order],
			};

			state.transaction = {
				transactionType: TransactionType.MAKE_ORDER,
				isPending: false,
				isSuccessful: true,
			};

			state.orderInProgress = false;
			// state.events = events; // non-serialized value
		},
	},
});

export const {
	exchangeBalancesLoaded,
	transferRequested,
	transferSuccess,
	transferFailed,
	makeOrderRequested,
	makeOrderFailed,
	makeOrderSuccess,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
