import useFetchGasPrice from "~/hooks/useFetchGasPrice";

import "./Balance.css";

const Balance = () => {
	const { gasFee, transactionFee, fetchGasPrice } = useFetchGasPrice();

	return (
		<section className="balance">
			<div className={`balance__info ${!gasFee ? "error" : ""}`}>
				<h3 className="balance__title">Trade / Balance</h3>
				<h3 className="balance__fee" onClick={fetchGasPrice} title="Click to update!">
					{gasFee && window.navigator.onLine ? (
						<>
							<i className="fa-solid fa-gas-pump"></i>
							<small>{gasFee.toFixed(0)}</small>
							<b>GWEI</b>
							<i>/</i>
							<strong>${transactionFee.toFixed(2)}</strong>
						</>
					) : (
						<span className="balance__error">
							{window.navigator.onLine ? "Loading, please wait..." : "Couldn't load the fees!"}
						</span>
					)}
				</h3>
			</div>
		</section>
	);
};

export default Balance;
