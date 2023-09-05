import { useState } from "react";

import { getETHPrice } from "~/services/ETHPriceService";
import { getGasFee } from "~/services/GasFeeService";

const useFetchGasPrice = () => {
	const [gasFee, setGasFee] = useState<number>(0);
	const [transactionFee, setTransactionFee] = useState<number>(0);

	const fetchGasPrice = async () => {
		try {
			const ETHPrice = await getETHPrice();
			const gasPrice = await getGasFee();

			setGasFee(gasPrice.speeds[1].baseFee);

			// A standard ETH transfer requires a gas limit of 21,000 units of gas
			// convert gasFee from gwei to eth and then multiply by the current eth price
			const trxFeeInDollars = gasFee * 21000 * 0.000000001 * ETHPrice.USD;
			setTransactionFee(trxFeeInDollars);
		} catch (err) {
			console.log("Please check out your network connection!");
			setGasFee(0);
		}
	};
	fetchGasPrice();

	return { gasFee, transactionFee, fetchGasPrice };
};

export default useFetchGasPrice;
