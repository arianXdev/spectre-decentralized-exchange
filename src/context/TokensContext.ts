import { createContext } from "react";

export const TokensContext = createContext({
	tokens: {
		SPEC: {
			contract: null,
			symbol: "SPEC",
		},
		mETH: {
			contract: null,
			symbol: "mETH",
		},
		mDAI: {
			contract: null,
			symbol: "mDAI",
		},
		mUSDT: {
			contract: null,
			symbol: "mUSDT",
		},
	},
});
