import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const connectionSlice = createSlice({
	name: "connection",
	initialState,
	reducers: {
		connectionLoaded: {
			reducer: (state, action) => {
				state.current = action.payload;
			},

			prepare: (chainId, account, balance) => {
				return {
					payload: {
						chainId,
						account,
						balance,
					},
				};
			},
		},
	},
});

export const { connectionLoaded } = connectionSlice.actions;

export default connectionSlice.reducer;
