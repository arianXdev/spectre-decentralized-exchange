import { useAppSelector } from "~/state/hooks";
import { selectTrades } from "~/state/exchange/exchangeSlice";

import { Icon } from "~/components";

import "./Trades.scss";

const Trades = () => {
	const filledOrders = useAppSelector(selectTrades);

	return (
		<section className="trades">
			<div className="trades__header">
				<h3 className="trades__title">
					<Icon name="filter-outline" />
					<span>Trades</span>
				</h3>
			</div>

			<div className="trades__body"></div>
		</section>
	);
};

export default Trades;
