interface Token {
	name: string;
	address: string;
	symbol: string;
	balance: string;
	decimals: number;
	imageURL: string;
}

export interface TokensStateType {
	loaded: boolean;
	token1: Token;
	token2: Token;
}
