import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ExchangeState {
	loaded: boolean;
	balances: { token1: string; token2: string };
	transaction: { transactionType: string; isPending: boolean; isSuccessful: boolean; hasError?: boolean };
	transferInProgress: boolean;
	events?: [];
}

const initialState = {
	loaded: false,
	balances: {
		token1: "0",
		token2: "0",
	},
	transferInProgress: false,
	events: [],
} as ExchangeState;

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
				transactionType: "TRANSFER",
				isPending: true,
				isSuccessful: false,
			};

			state.transferInProgress = true;
		},

		transferSuccess: (state) => {
			state.transaction = {
				transactionType: "TRANSFER",
				isPending: false,
				isSuccessful: true,
			};

			state.transferInProgress = false;
			// state.events = events; // non-serialized value
		},

		transferFailed: (state) => {
			state.transaction = {
				transactionType: "TRANSFER",
				isPending: false,
				isSuccessful: false,
				hasError: true,
			};

			state.transferInProgress = false;
		},
	},
});

export const { exchangeBalancesLoaded, transferRequested, transferSuccess, transferFailed } = exchangeSlice.actions;

export default exchangeSlice.reducer;
