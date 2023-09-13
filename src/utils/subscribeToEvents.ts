import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { transferSuccess, makeOrderSuccess } from "../state/exchange/exchangeSlice";

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
};
