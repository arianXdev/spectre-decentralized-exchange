import { configureStore } from "@reduxjs/toolkit";

import connectionReducer from "./connection/connectionSlice";
import tokensReducer from "./tokens/tokensSlice";
import exchangeReducer from "./exchange/exchangeSlice";

export const store = configureStore({
	reducer: {
		connection: connectionReducer,
		tokens: tokensReducer,
		exchange: exchangeReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
