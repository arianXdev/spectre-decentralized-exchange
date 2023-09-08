import { OrderType } from "~/state/exchange/types";

enum TOKEN_PRICE_COLOR {
	GREEN = "GREEN",
	RED = "RED",
}

export const getTokenPriceColor = (tokenPrice: number, orderId: string | number, prevOrder: OrderType) => {
	if (prevOrder.id === orderId) return TOKEN_PRICE_COLOR.GREEN;

	// return GREEN if the order price was higher than the previous order
	if (prevOrder.tokenPrice <= tokenPrice) return TOKEN_PRICE_COLOR.GREEN;
	// return RED if the order price was lower than the previous order
	else return TOKEN_PRICE_COLOR.RED;
};
