import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ConnectionStateType, ConnectionType } from "./types";

const initialState: ConnectionStateType = {
	current: null,
};

const connectionSlice = createSlice({
	name: "connection",
	initialState,
	reducers: {
		connected: {
			reducer: (state, action: PayloadAction<ConnectionType>) => {
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

		disconnected: (state) => {
			state.current = null;
		},
	},
});

export const { connected, disconnected } = connectionSlice.actions;

export default connectionSlice.reducer;
