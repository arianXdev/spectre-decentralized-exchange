import { utils } from "ethers";

import { AppDispatch } from "~/app/store";
import { makeOrderRequested, makeOrderFailed } from "~/features/exchange/exchangeSlice";

// MAKE ORDERS (SELL)
export const makeSellOrder = async (provider: any, exchange: any, tokens: [any, any], order, dispatch: AppDispatch) => {
	const tokenGet = tokens[1].address;
	const amountGet = utils.parseUnits((order.amount * order.price).toString(), 18);

	const tokenGive = tokens[0].address;
	// amountGive = orderAmount x orderPrice
	const amountGive = utils.parseUnits(order.amount, 18);

	dispatch(makeOrderRequested());

	try {
		const signer = await provider.getSigner();

		// Make order
		const transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);
		await transaction.wait();
	} catch (err) {
		dispatch(makeOrderFailed());
	}
};
