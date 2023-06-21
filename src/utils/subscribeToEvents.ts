import { transferSuccess } from "../features/exchange/exchangeSlice";
import { AppDispatch } from "~/app/store";

// Transfer tokens (Deposits & Withdraws)
enum TransferType {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

export const subscribeToEvents = (exchange, dispatch: AppDispatch) => {
	// When DEPOSIT happens, it's gonna notify the app
	exchange.on(TransferType.DEPOSIT, (event) => {
		// Notify app that transfer was successful
		dispatch(transferSuccess());
	});
};