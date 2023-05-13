import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const tokensSlice = createSlice({
	name: "tokens",
	initialState,
	reducers: {
		tokensLoaded: {
			reducer: (state, action) => {
				const { SPEC, mETH, mDAI, mUSDT } = action.payload;

				state.SPEC = SPEC;
				state.mETH = mETH;
				state.mDAI = mDAI;
				state.mUSDT = mUSDT;
			},

			prepare: ({ SPEC, mETH, mDAI, mUSDT }) => {
				return {
					payload: {
						SPEC: {
							name: SPEC.name,
							address: SPEC.address,
							symbol: SPEC.symbol,
							decimals: SPEC.decimals,
						},

						mETH: {
							name: mETH.name,
							address: mETH.address,
							symbol: mETH.symbol,
							decimals: mETH.decimals,
						},

						mDAI: {
							name: mDAI.name,
							address: mDAI.address,
							symbol: mDAI.symbol,
							decimals: mDAI.decimals,
						},

						mUSDT: {
							name: mUSDT.name,
							address: mUSDT.address,
							symbol: mUSDT.symbol,
							decimals: mUSDT.decimals,
						},
					},
				};
			},
		},
	},
});

export const { tokensLoaded } = tokensSlice.actions;

export default tokensSlice.reducer;
