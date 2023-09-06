import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ConnectionStateType } from "./types";

const initialState: ConnectionStateType = {
	current: null,
};

const connectionSlice = createSlice({
	name: "connection",
	initialState,
	reducers: {
		connected: {
			reducer: (state, action: PayloadAction<{ chainId: number; account: string; balance: string }>) => {
				state.current = action.payload;
			},

			prepare: (chainId: number, account: string, balance: string) => {
				return {
					payload: {
						chainId,
						account,
						balance,
					},
				};
			},
		},

		disconnected: (state) => {
			state.current = null;
		},
	},
});

export const { connected, disconnected } = connectionSlice.actions;

export default connectionSlice.reducer;
