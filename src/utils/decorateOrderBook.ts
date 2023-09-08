import _ from "lodash";

import { TokensStateType } from "~/state/tokens/types";
import { OrderType, ORDER_TYPE } from "~/state/exchange/types";

import { decorateOrder } from ".";

const decorateOrderBookOrder = (order: OrderType, { token2 }: TokensStateType) => {
	const token2Address = _.get(token2, "address", "");
	const orderType = order.tokenGive === token2Address ? ORDER_TYPE.BUY : ORDER_TYPE.SELL;

	const decoratedOrder = { ...order, orderType, orderFillAction: orderType === ORDER_TYPE.BUY ? ORDER_TYPE.SELL : ORDER_TYPE.BUY };
	return decoratedOrder;
};

export const decorateOrderBookOrders = (orders: OrderType[], tokens: TokensStateType): OrderType[] => {
	return orders.map((order: OrderType) => {
		order = decorateOrder(order, tokens);
		order = decorateOrderBookOrder(order, tokens);
		return order;
	});
};
