import { Token } from "~/state/tokens/types";

export interface DeployedData {
	[chainId: string]: {
		explorerURL: string;
		spectre: {
			address: string;
		};
		spectreToken: Token;
		mETH: Token;
		mDAI: Token;
		mUSDT: Token;
	};
}
