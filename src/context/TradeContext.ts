import { createContext } from "react";

export const TradeContext = createContext({
	status: "Withdraw",
	handleExchangeMarkets: () => {},
});
