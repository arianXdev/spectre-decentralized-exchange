import { ethers } from "ethers";

import { AppDispatch } from "~/state";
import { ExchangeType } from "~/context";
import { OrderType } from "~/state/exchange/types";

import { fillOrderFailed, fillOrderSuccess } from "~/state/exchange/exchangeSlice";

import { toast, ErrorIcon } from "react-hot-toast";

export const fillOrder = async (order: OrderType, provider: ethers.BrowserProvider, exchange: ExchangeType, dispatch: AppDispatch) => {
	let toastFillOrder: string | undefined;

	try {
		const signer = await provider.getSigner();

		toastFillOrder = toast.loading("Please confirm the transaction", {
			icon: <span className="toast-spinner visible"></span>,
			id: toastFillOrder,
		});

		const transaction = await exchange.connect(signer).fillOrder(order.id);

		toastFillOrder = toast.loading(`Proccessing...`, {
			icon: <span className="toast-spinner visible"></span>,
			id: toastFillOrder,
		});

		await transaction
			.wait()
			.then(() => toast.dismiss(toastFillOrder))
			.finally(() => toast.dismiss(toastFillOrder));

		// if the transaction was successful
		if (transaction) {
			toast.success("The order got filled successfully!", {
				duration: 5000,
			});

			// if the transaction was successful, then update the Redux store that will cause updating the UI
			dispatch(fillOrderSuccess(order));
		} else {
			toast.error("The transaction got rejected! Please try again.", {
				id: toastFillOrder,
				duration: 4000,
				icon: <ErrorIcon />,
			});
		}
	} catch (err) {
		dispatch(fillOrderFailed());

		toast.error("Sorry! Couldn't fill the order! Please try again.", {
			id: toastFillOrder,
			duration: 4000,
			icon: <ErrorIcon />,
		});
	}
};
