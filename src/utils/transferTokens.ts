import { ethers } from "ethers";

import { transferRequested, transferFailed } from "../features/exchange/exchangeSlice";

import { AppDispatch } from "../app/store";

export const transferTokens = async (provider, exchange, transferType: TransferType, token, amount: string, dispatch: AppDispatch) => {
	let transaction;

	dispatch(transferRequested());

	try {
		// Get the current user (i.e. in this case from MetaMask)
		const signer = await provider.getSigner();
		const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18);

		// Approve token transfering
		transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);
		await transaction.wait(); // wait to finish

		// Do the transfer (after the approval)
		transaction = await exchange.connect(signer).deposit(token.address, amountToTransfer);
		await transaction.wait();
	} catch (e) {
		dispatch(transferFailed());
		console.log(e);
	}

	// Recap: Events are a way for applications to subscribe to anything that's happened to the Blockchain and where / when it took place
};
