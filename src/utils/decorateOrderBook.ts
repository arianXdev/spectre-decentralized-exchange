import _ from "lodash";
import { TokensStateType } from "~/features/tokens/types";

import { decorateOrder } from ".";

enum OrderType {
	BUY = "BUY",
	SELL = "SELL",
}

const decorateOrderBookOrder = (order: any, { token2 }: TokensStateType) => {
	const token2Address = _.get(token2, "address", "");
	const orderType = order.tokenGive === token2Address ? OrderType.BUY : OrderType.SELL;

	const decoratedOrder = { ...order, orderType };
	return decoratedOrder;
};

export const decorateOrderBookOrders = (orders, tokens: TokensStateType) => {
	return orders.map((order) => {
		order = decorateOrder(order, tokens);
		order = decorateOrderBookOrder(order, tokens);
		return order;
	});
};
