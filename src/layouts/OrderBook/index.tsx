import { useAppSelector } from "~/state/hooks";

import { selectOrdersForOrderBook } from "~/state/exchange/exchangeSlice";
import { OrderType } from "~/state/exchange/types";

import { Icon } from "~/components";

import "./OrderBook.scss";

const OrderBook = () => {
	const token1 = useAppSelector((state) => state.tokens.token1);
	const token2 = useAppSelector((state) => state.tokens.token2);

	const orders = useAppSelector(selectOrdersForOrderBook);

	return (
		<section className="orderbook">
			<div className="orderbook__header">
				<h2 className="orderbook__title">Order Book</h2>
			</div>

			<div className="orderbook__container">
				<table className="orderbook__table orderbook__table--sell">
					<caption>
						<Icon name="caret-forward-outline" /> <i>Selling</i>
					</caption>

					<thead className={!orders || orders.SELL?.length === 0 ? "hidden" : ""}>
						<tr>
							<th>
								{token1 && token1.symbol}
								<span className="orderbook__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>

							<th>
								{token1 && token2 ? (
									<strong>
										{token1 && token1.symbol} / {token2 && token2.symbol}
									</strong>
								) : null}

								<span className="orderbook__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>

							<th>
								{token2 && token2.symbol}
								<span className="orderbook__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>
						</tr>
					</thead>

					{!orders || orders.SELL?.length === 0 ? (
						<caption className="orderbook__no-order-warning">No Sell Orders!</caption>
					) : (
						<tbody>
							{orders &&
								orders.SELL.map((order: OrderType) => (
									<tr key={order.id}>
										<td>{order.token1Amount}</td>
										<td className="token-price">{order.tokenPrice}</td>
										<td>{order.token2Amount}</td>
									</tr>
								))}
						</tbody>
					)}
				</table>

				<table className="orderbook__table orderbook__table--buy">
					<caption>
						<Icon name="caret-forward-outline" /> <i>Buying</i>
					</caption>

					<thead className={!orders || orders.BUY?.length === 0 ? "hidden" : ""}>
						<tr>
							<th>
								{token1 && token1.symbol}
								<span className="orderbook__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>

							<th>
								{token1 && token2 ? (
									<strong>
										{token1 && token1.symbol} / {token2 && token2.symbol}
									</strong>
								) : null}

								<span className="orderbook__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>

							<th>
								{token2 && token2.symbol}
								<span className="orderbook__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>
						</tr>
					</thead>

					{!orders || orders.BUY?.length === 0 ? (
						<caption className="orderbook__no-order-warning">No Buy Orders!</caption>
					) : (
						<tbody>
							{orders &&
								orders.BUY.map((order: OrderType) => (
									<tr key={order.id}>
										<td>{order.token1Amount}</td>
										<td className="token-price">{order.tokenPrice}</td>
										<td>{order.token2Amount}</td>
									</tr>
								))}
						</tbody>
					)}
				</table>
			</div>
		</section>
	);
};

export default OrderBook;