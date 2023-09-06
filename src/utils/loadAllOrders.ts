import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { allOrdersLoaded } from "~/state/exchange/exchangeSlice";

export const loadAllOrders = async (provider: ethers.BrowserProvider, exchange: ethers.ContractInterface, dispatch: AppDispatch) => {
	// get the current block number out of blockchain
	const block = await provider.getBlockNumber();

	// fetch all the orders using ethers queryFilter() function API
	const orderStream = await exchange.queryFilter("Order", 0, block);
	const allOrders = orderStream.map((event: ethers.EventLog) => event);

	// a serialized array of all orders (so we can store them inside of the Redux STORE)
	const serializedAllOrders: unknown[] = [];

	allOrders.map((order: { eventName: string; address: string; transactionHash: string; args: any }) => {
		serializedAllOrders.push({
			eventName: order.eventName,
			address: order.address,
			user: String(order.args.user),
			id: String(order.args.id),
			tokenGet: order.args.tokenGet,
			amountGet: String(order.args.amountGet),
			tokenGive: order.args.tokenGive,
			amountGive: String(order.args.amountGive),
			timestamp: Number(order.args.timestamp),
			transactionHash: order.transactionHash,
		});
	});

	dispatch(allOrdersLoaded(serializedAllOrders));
};
