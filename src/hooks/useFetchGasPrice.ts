import { useState } from "react";
import { getGasFee } from "~/services/GasFeeService";

const useFetchGasPrice = () => {
	const [gasFee, setGasFee] = useState<number>(0);
	const [transactionFee, setTransactionFee] = useState<number>(0);

	const fetchGasPrice = async () => {
		try {
			const gasFee = await getGasFee();
			setGasFee(gasFee.baseFee);

			// A standard ETH transfer requires a gas limit of 21,000 units of gas
			// convert gasFee from gwei to eth and then multiply by the current eth price
			const trxFeeInDollars = gasFee.baseFee * 21000 * 0.000000001 * gasFee.ethPrice;
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
