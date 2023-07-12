export interface ConnectionStateType {
	current: {
		chainId: number | null;
		account: string | null;
		balance: string | null;
	} | null;
}
