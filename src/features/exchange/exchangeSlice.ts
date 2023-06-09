import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ExchangeState {
	loaded: boolean;
	balances: { token1: string; token2: string };
}

const initialState = {
	loaded: false,
	balances: {
		token1: "0",
		token2: "0",
	},
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
	},
});

export const { exchangeBalancesLoaded } = exchangeSlice.actions;

export default exchangeSlice.reducer;
