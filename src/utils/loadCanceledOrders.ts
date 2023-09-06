import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { canceledOrdersLoaded } from "~/state/exchange/exchangeSlice";

export const loadCanceledOrders = async (provider: ethers.BrowserProvider, exchange: ethers.ContractInterface, dispatch: AppDispatch) => {
	// get the current block number out of blockchain
	const block = await provider.getBlockNumber();

	// fetch all the canceled orders using ethers queryFilter() function API
	const cancelStream = await exchange.queryFilter("CancelOrder", 0, block);
	const canceledOrders = cancelStream.map((event: ethers.EventLog) => event);

	// a serialized array of all the canceled orders (so we can store them inside of the Redux STORE)
	const serializedCanceledOrders: unknown[] = [];

	canceledOrders.map((order: { eventName: string; address: string; transactionHash: string; args: any }) => {
		serializedCanceledOrders.push({
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

	dispatch(canceledOrdersLoaded(serializedCanceledOrders));
};
