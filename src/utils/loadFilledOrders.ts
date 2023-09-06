import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { filledOrdersLoaded } from "~/state/exchange/exchangeSlice";

export const loadFilledOrders = async (provider: ethers.BrowserProvider, exchange: ethers.ContractInterface, dispatch: AppDispatch) => {
	// get the current block number out of blockchain
	const block = await provider.getBlockNumber();

	// fetch all the filled orders using ethers queryFilter() function API
	const tradeStream = await exchange.queryFilter("Trade", 0, block);
	const filledOrders = tradeStream.map((event: ethers.EventLog) => event);

	// a serialized array of all the filled orders (so we can store them inside of the Redux STORE)
	const serializedFilledOrders: unknown[] = [];

	// @param creator the person who is created the order
	// @param user  the person who is done the trade | filled the order | taker
	filledOrders.map((order: { eventName: string; address: string; transactionHash: string; args: any }) => {
		serializedFilledOrders.push({
			eventName: order.eventName,
			address: order.address,
			user: String(order.args.user),
			creator: String(order.args.creator),
			id: String(order.args.id),
			tokenGet: order.args.tokenGet,
			amountGet: String(order.args.amountGet),
			tokenGive: order.args.tokenGive,
			amountGive: String(order.args.amountGive),
			timestamp: Number(order.args.timestamp),
			transactionHash: order.transactionHash,
		});
	});

	dispatch(filledOrdersLoaded(serializedFilledOrders));
};
