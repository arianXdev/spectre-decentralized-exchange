import { ethers } from "ethers";

export interface TokensContextType {
	tokens: {
		[tokenSymbol: string]: {
			contract: ethers.Contract | null;
			symbol: string;
		};
	};
}

export interface ExchangeType {
	getAddress(): string;
	connect(signer: ethers.JsonRpcSigner): any;
	exchange: {
		makeOrder: any;
		cancelOrder: any;
		withdraw: any;
	};
}
