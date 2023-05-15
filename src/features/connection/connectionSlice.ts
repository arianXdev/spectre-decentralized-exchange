import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConnectionState {
	current: {
		chainId: number | null;
		account: string | null;
		balance: string | null;
	} | null;
}

const initialState: ConnectionState = {
	current: null,
};

const connectionSlice = createSlice({
	name: "connection",
	initialState,
	reducers: {
		connectionLoaded: {
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
	},
});

export const { connectionLoaded } = connectionSlice.actions;

export default connectionSlice.reducer;
