import { useAppSelector } from "~/state/hooks";

import { selectTrades } from "~/state/exchange/exchangeSlice";
import { OrderType } from "~/state/exchange/types";

import { Icon } from "~/components";

import "./Trades.scss";

const Trades = () => {
	const token1 = useAppSelector((state) => state.tokens?.token1);
	const token2 = useAppSelector((state) => state.tokens?.token2);

	const filledOrders = useAppSelector(selectTrades);

	return (
		<section className="trades">
			<div className="trades__header">
				<h3 className="trades__title">
					<Icon name="filter-outline" />
					<span>Trades</span>
				</h3>
			</div>

			<div className="trades__body">
				<table className="trades__table">
					<thead className={!filledOrders || filledOrders.length === 0 ? "hidden" : ""}>
						<tr>
							<th>
								<span>Time</span>
								<span className="trades__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>

							<th>
								{token1 && token1.symbol}
								<span className="trades__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>

							<th>
								{token1 && token1.symbol} / {token2 && token2.symbol}
								<span className="trades__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>
						</tr>
					</thead>

					{!filledOrders || filledOrders.length === 0 ? (
						<caption className="trades__no-order-warning">No Trades!</caption>
					) : (
						<tbody>
							{filledOrders &&
								filledOrders.map((trade: OrderType, index: string) => (
									<tr key={index}>
										<td>{trade.formattedTimestamp}</td>
										<td className={`tokenAmount ${trade.tokenPriceColor}`}>{trade.token1Amount}</td>
										<td className="tokenPrice">{trade.tokenPrice}</td>
									</tr>
								))}
						</tbody>
					)}
				</table>
			</div>
		</section>
	);
};

export default Trades;
