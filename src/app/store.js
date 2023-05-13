import { configureStore } from "@reduxjs/toolkit";

import connectionReducer from "../features/connection/connectionSlice";
import tokensReducer from "../features/tokens/tokensSlice";

export const store = configureStore({
	reducer: {
		connection: connectionReducer,
		tokens: tokensReducer,
	},
});
