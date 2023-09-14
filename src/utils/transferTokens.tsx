import { ethers } from "ethers";

import { transferRequested, transferFailed } from "../state/exchange/exchangeSlice";

import { AppDispatch } from "../state";
import { ExchangeType } from "~/context";

import { toast, ErrorIcon } from "react-hot-toast";

// Transfer tokens (Deposits & Withdraws)
enum TransferType {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

export const transferTokens = async (
	provider: ethers.BrowserProvider,
	exchange: ExchangeType,
	transferType: TransferType,
	token: any,
	amount: string,
	dispatch: AppDispatch
) => {
	let transaction;

	dispatch(transferRequested());

	let toastApprove: string | undefined;

	try {
		// Get the current user (i.e. in this case from MetaMask)
		const signer = await provider.getSigner();
		const amountToTransfer = ethers.parseUnits(amount.toString(), 18);

		if (transferType === TransferType.DEPOSIT) {
			toastApprove = toast.loading(`Please approve to do the ${transferType.toLowerCase()}...`, {
				icon: <span className={`toast-spinner ${token ? "visible" : ""}`}></span>,
			});

			// Approve token transfering
			transaction = await token.connect(signer).approve(await exchange.getAddress(), amountToTransfer);
			await transaction.wait(); // wait to finish

			toastApprove = toast.loading(`Please confirm the ${transferType.toLowerCase()} transaction`, {
				icon: <span className={`toast-spinner ${token ? "visible" : ""}`}></span>,
				id: toastApprove,
			});

			// Do the transfer (after the approval)
			transaction = await exchange.connect(signer).deposit(await token.getAddress(), amountToTransfer);

			toastApprove = toast.loading(`Proccessing...`, {
				icon: <span className={`toast-spinner ${token ? "visible" : ""}`}></span>,
				id: toastApprove,
			});

			await transaction
				.wait()
				.then(() => toast.dismiss(toastApprove))
				.finally(() => toast.dismiss(toastApprove));

			// if the transaction was successful
			if (transaction) {
				toast.success("The DEPOSIT transaction has been successful!", {
					duration: 6000,
				});
			} else {
				toast.error("The transaction got rejected! Please try again.", {
					id: toastApprove,
					duration: 4000,
					icon: <ErrorIcon />,
				});
			}
		} else if (transferType === TransferType.WITHDRAW) {
			toastApprove = toast.loading(`Please confirm the ${transferType.toLowerCase()} transaction`, {
				icon: <span className={`toast-spinner ${token ? "visible" : ""}`}></span>,
				id: toastApprove,
			});

			// Do the WITHDRAW transfer
			transaction = await exchange.connect(signer).withdraw(await token.getAddress(), amountToTransfer);

			toastApprove = toast.loading(`Proccessing...`, {
				icon: <span className={`toast-spinner ${token ? "visible" : ""}`}></span>,
				id: toastApprove,
			});

			await transaction
				.wait()
				.then(() => toast.dismiss(toastApprove))
				.finally(() => toast.dismiss(toastApprove));

			// if the transaction was successful
			if (transaction) {
				toast.success("The WITHDRAW transaction has been successful!", {
					duration: 6000,
				});
			} else {
				toast.error("The transaction got rejected! Please try again.", {
					id: toastApprove,
					duration: 4000,
					icon: <ErrorIcon />,
				});
			}
		} else {
			toast.dismiss(toastApprove);

			dispatch(transferFailed());
			throw new Error("Invalid Transfer Type! Make sure the Transfer Type has been passed properly.");
		}

		await transaction.wait();
	} catch (e) {
		toast.error("The transaction got rejected! Please try again.", {
			id: toastApprove,
			duration: 4000,
			icon: <ErrorIcon />,
		});

		dispatch(transferFailed());
	}
};
