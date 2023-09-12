import { decorateOrder } from ".";

import { ORDER_TYPE, OrderType } from "~/state/exchange/types";
import { TokensStateType } from "~/state/tokens/types";

enum ORDER_COLOR {
	GREEN = "GREEN",
	RED = "RED",
}

// Open Orders
export const decorateUserOpenOrders = (orders: Array<OrderType>, tokens: TokensStateType) => {
	const decoratedOpenOrders = orders.map((order) => {
		order = decorateOrder(order, tokens);
		order = decorateUserOpenOrder(order, tokens);

		return order;
	});

	return decoratedOpenOrders;
};

export const decorateUserOpenOrder = (order: OrderType, tokens: TokensStateType) => {
	let orderType = order.tokenGive === tokens.token2.address ? ORDER_TYPE.BUY : ORDER_TYPE.SELL;

	return {
		...order,
		orderType,
		orderTypeClass: orderType === ORDER_TYPE.BUY ? ORDER_COLOR.GREEN : ORDER_COLOR.RED,
	};
};

// Filled Orders / Trades
export const decorateUserFilledOrders = (orders: Array<OrderType>, account: string, tokens: TokensStateType) => {
	const decoratedFilledOrders = orders.map((order) => {
		order = decorateOrder(order, tokens);
		order = decorateUserFilledOrder(order, account, tokens);

		return order;
	});

	return decoratedFilledOrders;
};

export const decorateUserFilledOrder = (order: OrderType, account: string, tokens: TokensStateType) => {
	// check to see if the user has created the order and not somebody else | the user must be creator
	const isUserCreator = order.creator === account;
	let orderType: ORDER_TYPE;

	if (isUserCreator) {
		orderType = order.tokenGive === tokens.token2.address ? ORDER_TYPE.BUY : ORDER_TYPE.SELL;
	} else {
		orderType = order.tokenGive === tokens.token2.address ? ORDER_TYPE.SELL : ORDER_TYPE.BUY;
	}

	return {
		...order,
		orderType,
		orderTypeClass: orderType === ORDER_TYPE.BUY ? ORDER_COLOR.GREEN : ORDER_COLOR.RED,
		orderTypeSign: orderType === ORDER_TYPE.BUY ? "+" : "-",
	};
};
