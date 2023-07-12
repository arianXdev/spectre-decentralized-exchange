// Define a type for the slice state
export interface TokensStateType {
	loaded: boolean;
	token1?: { name: string; address: string; symbol: string; balance: string; decimals: number; imageURL: string };
	token2?: { name: string; address: string; symbol: string; balance: string; decimals: number; imageURL: string };
}
