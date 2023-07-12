// Define a type for the slice state
export interface ExchangeStateType {
	loaded: boolean;
	balances: { token1: string; token2: string };
	orders?: { loaded: boolean; allOrders: unknown[] | object };
	transaction: { transactionType: TransactionType; isPending: boolean; isSuccessful: boolean; hasError?: boolean };
	transferInProgress: boolean;
	orderInProgress: boolean;
	events?: [];
}

export enum TransactionType {
	TRANSFER = "TRANSFER",
	MAKE_ORDER = "MAKE ORDER",
	FILL_ORDER = "FILL ORDER",
	CANCEL_ORDER = "CANCEL ORDER",
}
