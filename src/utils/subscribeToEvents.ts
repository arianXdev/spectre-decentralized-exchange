import { ethers } from "ethers";

import { AppDispatch } from "~/app/store";
import { transferSuccess, makeOrderSuccess } from "../features/exchange/exchangeSlice";

// Transfer tokens (Deposits & Withdraws)
enum TransferType {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

export const subscribeToEvents = (exchange: ethers.ContractInterface, dispatch: AppDispatch) => {
	// When DEPOSIT happens, it's gonna notify the app
	exchange.on(TransferType.DEPOSIT, (event: ethers.EventLog) => {
		// Notify app that transfer was successful
		dispatch(transferSuccess());
	});

	// When WITHDRAW happens, it's gonna notify the app
	exchange.on(TransferType.WITHDRAW, (event: ethers.EventLog) => {
		// Notify app that transfer was successful
		dispatch(transferSuccess());
	});

	// When MAKE ORDER happens, it's gonna notify the app
	exchange.on(
		"Order",
		async (
			id: string,
			user: string,
			tokenGet: string,
			amountGet: string,
			tokenGive: string,
			amountGive: string,
			timestamp: string,
			event
		) => {
			const order = {
				id: id.toString(),
				user,
				tokenGet,
				amountGet: amountGet.toString(),
				tokenGive,
				amountGive: amountGive.toString(),
				timestamp: timestamp.toString(),
			};

			// Notify app that the make order trx was successful
			dispatch(makeOrderSuccess());
		}
	);
};
