import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../../app/store";

// Define a type for the slice state
interface TokensState {
	loaded: boolean;
	token1?: { name: string; address: string; symbol: string; decimals: number; imageURL: string };
	token2?: { name: string; address: string; symbol: string; decimals: number; imageURL: string };
}

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
	},
});

export const { tokensLoaded } = tokensSlice.actions;

export default tokensSlice.reducer;
