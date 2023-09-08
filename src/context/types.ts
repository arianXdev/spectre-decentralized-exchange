import { ethers } from "ethers";

export interface TokensContextType {
	tokens: {
		[tokenSymbol: string]: {
			contract: ethers.Contract | null;
			symbol: string;
		};
	};
}
