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

			prepare: (chainId, account) => {
				return {
					payload: {
						account,
						chainId,
					},
				};
			},
		},
	},
});

export const { connectionLoaded } = connectionSlice.actions;

export default connectionSlice.reducer;
