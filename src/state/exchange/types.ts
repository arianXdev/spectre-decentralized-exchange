// Define a type for the slice state
export interface ExchangeStateType {
	loaded: boolean;
	balances: { token1: string; token2: string };
	orders?: { loaded: boolean; allOrders: unknown[] | object; canceledOrders: unknown[] | object; filledOrders: unknown[] | object };
	transaction: { transactionType: TransactionType; isPending: boolean; isSuccessful: boolean; hasError?: boolean };
	transferInProgress: boolean;
	orderInProgress: boolean;
	events?: [];

	// tokenBalances
	token1: string;
	token2: string;
}

export interface OrderType {
	orderType: ORDER_TYPE;
	address: string;
	amountGet: string | number;
	amountGive: string | number;
	eventName: "Order";
	id: string | number;
	timestamp: number;
	tokenGet: string;
	tokenGive: string;
	transactionHash: string;
	user: string;
	tokenPrice: number;
	token1Amount: number | string;
	token2Amount: number | string;
	formattedTimestamp: string;
	orderFillAction: ORDER_TYPE;
}

export enum ORDER_TYPE {
	BUY = "BUY",
	SELL = "SELL",
}

export enum TransactionType {
	TRANSFER = "TRANSFER",
	MAKE_ORDER = "MAKE ORDER",
	FILL_ORDER = "FILL ORDER",
	CANCEL_ORDER = "CANCEL ORDER",
}
