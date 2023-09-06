import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokensState } from "./types";

const initialState = {
	loaded: false,
} as TokensState;

const tokensSlice = createSlice({
	name: "tokens",
	initialState,
	reducers: {
		tokensLoaded: {
			reducer: (state, action: PayloadAction<TokensState>) => {
				const { token1, token2 } = action.payload;

				state.token1 = token1;
				state.token2 = token2;

				state.loaded = true;
			},

			prepare: ({ token1, token2 }) => {
				return {
					payload: {
						token1: {
							name: token1.name,
							address: token1.address,
							symbol: token1.symbol,
							decimals: token1.decimals,
							imageURL: token1.imageURL,
						},

						token2: {
							name: token2.name,
							address: token2.address,
							symbol: token2.symbol,
							decimals: token2.decimals,
							imageURL: token2.imageURL,
						},
					},
				};
			},
		},

		balancesLoaded: (state, action: PayloadAction<TokensState>) => {
			const { token1Balance, token2Balance } = action.payload;

			state.token1.balance = token1Balance;
			state.token2.balance = token2Balance;
		},
	},
});

export const { tokensLoaded, balancesLoaded } = tokensSlice.actions;

export default tokensSlice.reducer;
