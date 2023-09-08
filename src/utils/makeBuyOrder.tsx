import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { makeOrderRequested, makeOrderFailed } from "~/state/exchange/exchangeSlice";

import { toast, ErrorIcon } from "react-hot-toast";

// MAKE ORDERS (BUY)
export const makeBuyOrder = async (
	provider: ethers.BrowserProvider,
	exchange: ethers.ContractInterface,
	tokens: Array<ethers.Contract>,
	order: { [key: string]: string },
	dispatch: AppDispatch
) => {
	const tokenGet = await tokens[0].getAddress();
	const amountGet = ethers.parseUnits(order.amount.toString(), 18);

	const tokenGive = await tokens[1].getAddress();
	// amountGive = orderAmount x orderPrice
	const amountGive = ethers.parseUnits((Number(order.amount) * Number(order.price)).toString(), 18);

	dispatch(makeOrderRequested());

	let toastBuyOrder: string | undefined;

	try {
		const signer = await provider.getSigner();

		toastBuyOrder = toast.loading("Please confirm the transaction", {
			icon: <span className="toast-spinner visible"></span>,
			id: toastBuyOrder,
		});

		// Make order
		const transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);

		toastBuyOrder = toast.loading(`Proccessing...`, {
			icon: <span className="toast-spinner visible"></span>,
			id: toastBuyOrder,
		});

		await transaction
			.wait()
			.then(() => toast.dismiss(toastBuyOrder))
			.finally(() => toast.dismiss(toastBuyOrder));

		// if the transaction was successful
		if (transaction) {
			toast.success("You made a BUY order successfully!", {
				duration: 5000,
			});
		} else {
			toast.error("The transaction got rejected! Please try again.", {
				id: toastBuyOrder,
				duration: 4000,
				icon: <ErrorIcon />,
			});
		}
	} catch (err) {
		dispatch(makeOrderFailed());

		toast.error("Sorry! Couldn't make an order! Please try again.", {
			id: toastBuyOrder,
			duration: 4000,
			icon: <ErrorIcon />,
		});
	}
};
