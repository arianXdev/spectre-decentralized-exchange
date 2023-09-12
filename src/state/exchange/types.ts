import { ethers } from "ethers";

export enum ORDER_TYPE {
	BUY = "BUY",
	SELL = "SELL",
}

export enum TRANSACTION_TYPE {
	TRANSFER = "TRANSFER",
	MAKE_ORDER = "MAKE ORDER",
	FILL_ORDER = "FILL ORDER",
	CANCEL_ORDER = "CANCEL ORDER",
}

export interface OrderType {
	readonly orderType: ORDER_TYPE;

	readonly id: string | number;
	readonly address: string;
	readonly eventName: "Order";
	readonly timestamp: number;
	readonly transactionHash: string;

	amountGet: string | number;
	amountGive: string | number;
	tokenGet: string;
	tokenGive: string;
	user: string;
	creator?: string;
	tokenPrice: number;
	token1Amount: number | string;
	token2Amount: number | string;
	formattedTimestamp?: string;
	orderFillAction?: ORDER_TYPE;
	tokenPriceColor?: string;
	orderTypeClass?: string;
	orderTypeSign?: string;
}

export interface OrdersType {
	loaded: boolean;
	allOrders: OrderType[] | object;
	canceledOrders: OrderType[] | object;
	filledOrders: OrderType[] | object;
}

interface TransactionType {
	transactionType: TRANSACTION_TYPE;
	isPending: boolean;
	isSuccessful: boolean;
	hasError?: boolean;
}

export interface ExchangeStateType extends OrdersType {
	loaded: boolean;
	balances: { token1: string; token2: string };
	orders?: OrdersType;
	transaction: TransactionType;
	transferInProgress: boolean;
	orderInProgress: boolean;
	events?: Array<ethers.ContractEvent>;

	// tokenBalances
	token1: string;
	token2: string;
}
