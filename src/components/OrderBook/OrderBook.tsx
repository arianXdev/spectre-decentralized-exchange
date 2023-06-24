import "./OrderBook.scss";

const OrderBook = () => {
	return (
		<section className="orderbook">
			<div className="orderbook__header">
				<h2 className="orderbook__title">Order Book</h2>
			</div>

			<div className="orderbook__container">
				<table className="orderbook__table orderbook__table--sell">
					<caption>Selling</caption>

					<thead>
						<tr>
							<th></th>
							<th></th>
							<th></th>
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
					<caption>Buying</caption>

					<thead>
						<tr>
							<th></th>
							<th></th>
							<th></th>
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
