import { useAppSelector } from "~/app/hooks";

import "./PriceChart.scss";

const PriceChart = () => {
	// Get the account from the Redux store
	const account = useAppSelector((state) => state.connection.current?.account);

	return (
		<section className="chart">
			<div className="chart__header"></div>
			<div className="chart__container">
				{account ? <p>Candlestick Chart goes here!</p> : <p className="chart__connect-wallet-alert">Please CONNECT YOUR WALLET</p>}
			</div>
		</section>
	);
};

export default PriceChart;
