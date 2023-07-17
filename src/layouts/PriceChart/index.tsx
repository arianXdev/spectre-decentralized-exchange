import { useAppSelector } from "~/app/hooks";

import "./PriceChart.scss";

const PriceChart = () => {
	// Get the account from the Redux store
	const account = useAppSelector((state) => state.connection.current?.account);

	// Get token pairs from the state
	const tokens = useAppSelector((state) => state.tokens);

	return (
		<section className="chart">
			<div className="chart__header">
				<strong className="chart__token-pair">
					{tokens && tokens.token1?.symbol} / {tokens && tokens.token2?.symbol}
				</strong>
			</div>

			<div className="chart__container">
				{account ? <p>Candlestick Chart goes here!</p> : <p className="chart__connect-wallet-alert">Please CONNECT YOUR WALLET</p>}
			</div>
		</section>
	);
};

export default PriceChart;
