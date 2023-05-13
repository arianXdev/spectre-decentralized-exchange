import { configureStore } from "@reduxjs/toolkit";

import connectionReducer from "../features/connection/connectionSlice";

export const store = configureStore({
	reducer: {
		connection: connectionReducer,
	},
});
