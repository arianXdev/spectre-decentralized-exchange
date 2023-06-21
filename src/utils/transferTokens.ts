import { ethers } from "ethers";

import { transferRequested, transferFailed } from "../features/exchange/exchangeSlice";

import { AppDispatch } from "../app/store";

// Transfer tokens (Deposits & Withdraws)
enum TransferType {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

export const transferTokens = async (
	provider: any,
	exchange: any,
	transferType: TransferType,
	token,
	amount: string,
	dispatch: AppDispatch
) => {
	let transaction;

	dispatch(transferRequested());

	try {
		// Get the current user (i.e. in this case from MetaMask)
		const signer = await provider.getSigner();
		const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18);

		if (transferType === TransferType.DEPOSIT) {
			// Approve token transfering
			transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);
			await transaction.wait(); // wait to finish

			// Do the transfer (after the approval)
			transaction = await exchange.connect(signer).deposit(token.address, amountToTransfer);
		} else if (transferType === TransferType.WITHDRAW) {
			// Do the WITHDRAW transfer
			transaction = await exchange.connect(signer).withdraw(token.address, amountToTransfer);
		} else {
			dispatch(transferFailed());
			throw new Error("Invalid Transfer Type! Make sure the Transfer Type has been passed properly.");
		}

		await transaction.wait();
	} catch (e) {
		dispatch(transferFailed());
	}
};
