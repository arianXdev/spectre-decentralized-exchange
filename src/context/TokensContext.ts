import { createContext } from "react";

export const TokensContext = createContext({
	tokens: {
		SPEC: {
			contract: null,
			symbol: "",
		},
		mETH: {
			contract: null,
			symbol: "",
		},
		mDAI: {
			contract: null,
			symbol: "",
		},
		mUSDT: {
			contract: null,
			symbol: "",
		},
	},
});
