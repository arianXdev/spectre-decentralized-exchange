import deployed from "./deployed.json";
import { DeployedData } from "./types";

export const getMarketsList = (chainId: string) => {
	const currentConnection = (deployed as DeployedData)[chainId];

	const MarketsList = [
		{
			token1: {
				symbol: "SPEC",
				address: currentConnection.spectreToken.address,
			},
			token2: {
				symbol: "mETH",
				address: currentConnection.mETH.address,
			},
		},

		{
			token1: {
				symbol: "SPEC",
				address: currentConnection.spectreToken.address,
			},
			token2: {
				symbol: "mDAI",
				address: currentConnection.mDAI.address,
			},
		},

		{
			token1: {
				symbol: "SPEC",
				address: currentConnection.spectreToken.address,
			},
			token2: {
				symbol: "mUSDT",
				address: currentConnection.mUSDT.address,
			},
		},

		{
			token1: {
				symbol: "mDAI",
				address: currentConnection.mDAI.address,
			},
			token2: {
				symbol: "mETH",
				address: currentConnection.mETH.address,
			},
		},

		{
			token1: {
				symbol: "mETH",
				address: currentConnection.mETH.address,
			},
			token2: {
				symbol: "mUSDT",
				address: currentConnection.mUSDT.address,
			},
		},
		{
			token1: {
				symbol: "mUSDT",
				address: currentConnection.mUSDT.address,
			},
			token2: {
				symbol: "mDAI",
				address: currentConnection.mDAI.address,
			},
		},
	];

	return MarketsList;
};
