import _ from "lodash";

import { decorateOrder, getTokenPriceColor } from ".";

import { TokensStateType } from "~/state/tokens/types";
import { OrderType } from "~/state/exchange/types";

// decorates the filled orders (means it adds more details to the orders and then returns the decorated orders)
export const decorateFilledOrders = (orders: OrderType[], tokens: TokensStateType) => {
	// gets the previous order to compare history
	let previousOrder = orders[0];

	const decoratedOrders = orders.map((order) => {
		// decorate each individual order
		// we're using decorateOrder() in here as we need to have token price
		order = decorateOrder(order, tokens);
		order = decorateFilledOrder(order, previousOrder);
		// update the previous order once it's decorated
		previousOrder = order;

		return order;
	});

	return decoratedOrders;
};

export const decorateFilledOrder = (order: OrderType, previousOrder: OrderType) => {
	const decoratedOrder = {
		...order,
		tokenPriceColor: getTokenPriceColor(order.tokenPrice, order.id, previousOrder),
	};

	return decoratedOrder;
};
