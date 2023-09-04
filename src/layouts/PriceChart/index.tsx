import { useAppSelector } from "~/app/hooks";

import Chart from "react-apexcharts";
import { options, series } from "./PriceChart.config.js";

import "./PriceChart.scss";

const PriceChart = () => {
	// Get the account from the Redux store
	const account = useAppSelector((state) => state.connection.current?.account);

	// Get token pairs from the state
	const tokens = useAppSelector((state) => state.tokens);

	return (
		<section className="chart">
			<div className="chart__header">
				{tokens && tokens.loaded ? (
					<strong className="chart__token-pair">
						{tokens && tokens.token1?.symbol} / {tokens && tokens.token2?.symbol}
					</strong>
				) : null}
			</div>

			<div className="chart__container">
				{account ? (
					<Chart type="candlestick" options={options} series={series} width="100%" height="100%" className="chart__candlestick" />
				) : (
					<p className="chart__connect-wallet-alert">Please CONNECT YOUR WALLET</p>
				)}
			</div>
		</section>
	);
};

export default PriceChart;