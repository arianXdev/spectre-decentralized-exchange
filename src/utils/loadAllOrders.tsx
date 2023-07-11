import { ethers } from "ethers";

import { AppDispatch } from "../app/store";
import { allOrdersLoaded } from "~/features/exchange/exchangeSlice";

export const loadAllOrders = async (provider: ethers.BrowserProvider, exchange: ethers.ContractInterface, dispatch: AppDispatch) => {
	// get the current block number out of blockchain
	const block = await provider.getBlockNumber();

	// fetch all the orders
	const orderStream = await exchange.queryFilter("Order", 0, block);
	const allOrders = orderStream.map((event: ethers.EventLog) => event);

	console.log(allOrders);

	dispatch(allOrdersLoaded());
};
