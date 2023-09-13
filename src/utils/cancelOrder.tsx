import { ethers } from "ethers";

import { AppDispatch } from "~/state";
import { ExchangeType } from "~/context";
import { OrderType } from "~/state/exchange/types";

import { cancelOrderRequested, cancelOrderFailed, cancelOrderSuccess } from "~/state/exchange/exchangeSlice";

import { toast, ErrorIcon } from "react-hot-toast";

export const cancelOrder = async (order: OrderType, provider: ethers.BrowserProvider, exchange: ExchangeType, dispatch: AppDispatch) => {
	dispatch(cancelOrderRequested());

	let toastCancelOrder: string | undefined;

	try {
		const signer = await provider.getSigner();

		toastCancelOrder = toast.loading("Please confirm the transaction", {
			icon: <span className="toast-spinner visible"></span>,
			id: toastCancelOrder,
		});

		const transaction = await exchange.connect(signer).cancelOrder(order.id);

		toastCancelOrder = toast.loading(`Proccessing...`, {
			icon: <span className="toast-spinner visible"></span>,
			id: toastCancelOrder,
		});

		await transaction
			.wait()
			.then(() => toast.dismiss(toastCancelOrder))
			.finally(() => toast.dismiss(toastCancelOrder));

		// if the transaction was successful
		if (transaction) {
			toast.success("The order got canceled successfully!", {
				duration: 5000,
			});

			// if the transaction was successful, then update the Redux store that will cause updating the UI
			dispatch(cancelOrderSuccess(order));
		} else {
			toast.error("The transaction got rejected! Please try again.", {
				id: toastCancelOrder,
				duration: 4000,
				icon: <ErrorIcon />,
			});
		}
	} catch (err) {
		dispatch(cancelOrderFailed());

		toast.error("Sorry! Couldn't cancel the order! Please try again.", {
			id: toastCancelOrder,
			duration: 4000,
			icon: <ErrorIcon />,
		});
	}
};
