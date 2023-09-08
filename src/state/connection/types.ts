export interface ConnectionType {
	chainId: number;
	account: string;
	balance: string;
}

export interface ConnectionStateType {
	current: ConnectionType | null;
}
