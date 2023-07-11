import { useAppSelector } from "~/app/hooks";

import { Icon } from "..";

import "./OrderBook.scss";

const OrderBook = () => {
	const token1 = useAppSelector((state) => state.tokens.token1);
	const token2 = useAppSelector((state) => state.tokens.token2);

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

					<thead>
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

					<tbody>
						<tr>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>

				<table className="orderbook__table orderbook__table--buy">
					<caption>
						<Icon name="caret-forward-outline" /> <i>Buying</i>
					</caption>

					<thead>
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
							</th>

							<th>
								{token2 && token2.symbol}
								<span className="orderbook__sort">
									<Icon name="chevron-expand" />
								</span>
							</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default OrderBook;
