import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { transferSuccess, makeOrderSuccess, fillOrderSuccess } from "../state/exchange/exchangeSlice";

// Transfer tokens (Deposits & Withdraws)
enum TransferType {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

export const subscribeToEvents = (exchange: ethers.ContractInterface, dispatch: AppDispatch) => {
	// When DEPOSIT happens, it's gonna notify the app
	exchange.on(TransferType.DEPOSIT, () => {
		// Notify app that transfer was successful
		dispatch(transferSuccess());
	});

	// When WITHDRAW happens, it's gonna notify the app
	exchange.on(TransferType.WITHDRAW, () => {
		// Notify app that transfer was successful
		dispatch(transferSuccess());
	});

	// When MAKE ORDER happens, it's gonna notify the app
	exchange.on("Order", async () => {
		// Notify app that the make order trx was successful
		dispatch(makeOrderSuccess());
	});

	// When FILL ORDER / TRADE happens, it's gonna notify the app
	exchange.on(
		"Trade",
		async (
			id: string,
			user: string,
			tokenGet: string,
			amountGet: string,
			tokenGive: string,
			amountGive: string,
			creator: string,
			timestamp: number,
			event: any
		) => {
			// a serialized array of all the filled order (so we can store them inside of the Redux STORE)
			// @param creator the person who is created the order
			// @param user  the person who is done the trade | filled the order | taker
			let serializedFilledOrder = {
				eventName: event.eventName,
				// address: event.args.address,
				user: String(user),
				creator: String(creator),
				id: String(id),
				tokenGet: tokenGet,
				amountGet: String(amountGet),
				tokenGive: tokenGive,
				amountGive: String(amountGive),
				timestamp: Number(timestamp),
				// transactionHash: event.args.transactionHash,
			};

			dispatch(fillOrderSuccess(serializedFilledOrder));
		}
	);
};
