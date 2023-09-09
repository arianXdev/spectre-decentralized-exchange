import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { ExchangeType } from "~/context";
import { makeOrderRequested, makeOrderFailed } from "~/state/exchange/exchangeSlice";

import { toast, ErrorIcon } from "react-hot-toast";

// MAKE ORDERS (SELL)
export const makeSellOrder = async (
	provider: ethers.BrowserProvider,
	exchange: ExchangeType,
	tokens: Array<ethers.Contract>,
	order: { [key: string]: string },
	dispatch: AppDispatch
) => {
	const tokenGet = await tokens[1].getAddress();
	const amountGet = ethers.parseUnits((Number(order.amount) * Number(order.price)).toString(), 18);

	const tokenGive = await tokens[0].getAddress();
	// amountGive = orderAmount x orderPrice
	const amountGive = ethers.parseUnits(order.amount.toString(), 18);

	dispatch(makeOrderRequested());

	let toastSellOrder: string | undefined;

	try {
		const signer = await provider.getSigner();

		toastSellOrder = toast.loading("Please confirm the transaction", {
			icon: <span className="toast-spinner visible"></span>,
			id: toastSellOrder,
		});

		// Make order
		const transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);

		toastSellOrder = toast.loading(`Proccessing...`, {
			icon: <span className="toast-spinner visible"></span>,
			id: toastSellOrder,
		});

		await transaction
			.wait()
			.then(() => toast.dismiss(toastSellOrder))
			.finally(() => toast.dismiss(toastSellOrder));

		// if the transaction was successful
		if (transaction) {
			toast.success("You made a SELL order successfully!", {
				duration: 5000,
			});
		} else {
			toast.error("The transaction got rejected! Please try again.", {
				id: toastSellOrder,
				duration: 4000,
				icon: <ErrorIcon />,
			});
		}
	} catch (err) {
		dispatch(makeOrderFailed());

		toast.error("Sorry! Couldn't make an order! Please try again.", {
			id: toastSellOrder,
			duration: 4000,
			icon: <ErrorIcon />,
		});
	}
};
