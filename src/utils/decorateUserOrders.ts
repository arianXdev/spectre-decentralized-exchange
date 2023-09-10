import { decorateOrder } from ".";

import { ORDER_TYPE, OrderType } from "~/state/exchange/types";
import { TokensStateType } from "~/state/tokens/types";

export const decorateUserOpenOrders = (orders: Array<OrderType>, tokens: TokensStateType) => {
	const decoratedOpenOrders = orders.map((order) => {
		order = decorateOrder(order, tokens);
		order = decorateUserOpenOrder(order, tokens);

		return order;
	});

	return decoratedOpenOrders;
};

enum ORDER_COLOR {
	GREEN = "GREEN",
	RED = "RED",
}

export const decorateUserOpenOrder = (order: OrderType, tokens: TokensStateType) => {
	let orderType = order.tokenGive === tokens.token2.address ? ORDER_TYPE.BUY : ORDER_TYPE.SELL;

	return {
		...order,
		orderType,
		orderTypeClass: orderType === ORDER_TYPE.BUY ? ORDER_COLOR.GREEN : ORDER_COLOR.RED,
	};
};
