export interface Token {
	name: string;
	address: string;
	symbol: string;
	balance: string;
	decimals: number;
	imageURL: string;

	token1Balance: string;
	token2Balance: string;
}

export interface TokensStateType extends Token {
	loaded: boolean;
	token1: Token;
	token2: Token;
}
