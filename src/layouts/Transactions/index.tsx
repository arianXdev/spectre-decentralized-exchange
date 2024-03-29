import { useState, useContext } from "react";
import { useAppDispatch, useAppSelector } from "~/state/hooks";

import { OrderType } from "~/state/exchange/types";
import { selectUserOpenOrders, selectUserFilledOrders } from "~/state/exchange/exchangeSlice";
import { EthersContext, ExchangeContext, ExchangeType } from "~/context";

import { cancelOrder } from "~/utils";

import classNames from "classnames";
import { Icon } from "~/components";

import "./Transactions.scss";

enum Tabs {
	ORDERS,
	TRADES,
}

const Transactions = () => {
	const dispatch = useAppDispatch();

	const token1 = useAppSelector((state) => state.tokens?.token1);
	const token2 = useAppSelector((state) => state.tokens?.token2);

	const userOpenOrders = useAppSelector(selectUserOpenOrders);
	const userFilledOrders = useAppSelector(selectUserFilledOrders);

	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.ORDERS);

	const { provider } = useContext(EthersContext);
	const { exchange } = useContext(ExchangeContext);

	const ordersTabClass = classNames({
		transactions__tab: true,
		"transactions__tab--orders": true,
		"transactions__tab--active": activeTab === Tabs.ORDERS,
	});

	const tradesTabClass = classNames({
		transactions__tab: true,
		"transactions__tab--trades": true,
		"transactions__tab--active": activeTab === Tabs.TRADES,
	});

	const onCancelOrderClicked = (order: OrderType) => {
		cancelOrder(order, provider, exchange as ExchangeType, dispatch);
	};
	return (
		<section className="transactions">
			<div className="transactions__header">
				<h3 className="transactions__title">
					<Icon name="clipboard-outline" />
					<span>{activeTab === Tabs.ORDERS ? "My Orders" : "My Transactions"}</span>
				</h3>

				<div className="transactions__tabs">
					<button className={ordersTabClass} onClick={() => setActiveTab(Tabs.ORDERS)}>
						Orders
					</button>
					<button className={tradesTabClass} onClick={() => setActiveTab(Tabs.TRADES)}>
						Trades
					</button>
				</div>
			</div>

			<div className="transactions__body">
				{activeTab === Tabs.ORDERS ? (
					<table className="transactions__table transactions__table--orders">
						<thead className={!userOpenOrders || userOpenOrders.length === 0 ? "hidden" : "thead--orders"}>
							<tr>
								<th>
									{token1 && token1.symbol}
									<span className="transactions__sort">
										<Icon name="chevron-expand" />
									</span>
								</th>

								<th>
									{token1 && token1.symbol} / {token2 && token2.symbol}
									<span className="transactions__sort">
										<Icon name="chevron-expand" />
									</span>
								</th>
							</tr>
						</thead>

						{!userOpenOrders || userOpenOrders.length === 0 ? (
							<caption className="transactions__no-order-warning">No Open Orders!</caption>
						) : (
							<tbody>
								{userOpenOrders &&
									userOpenOrders.map((order: OrderType, index: string | number) => (
										<tr key={index}>
											<td className={`tokenAmount ${order.orderTypeClass}`}>{order.token1Amount}</td>
											<td className="tokenPrice">{order.tokenPrice}</td>
											<td>
												<button onClick={() => onCancelOrderClicked(order)} className="transactions__cancel-btn">
													CANCEL
												</button>
											</td>
										</tr>
									))}
							</tbody>
						)}
					</table>
				) : (
					<table className="transactions__table transactions__table--trades">
						<thead className={!userFilledOrders || userFilledOrders.length === 0 ? "hidden" : ""}>
							<tr>
								<th>
									<span>Time</span>
									<span className="transactions__sort">
										<Icon name="chevron-expand" />
									</span>
								</th>

								<th>
									{token1 && token1.symbol}
									<span className="transactions__sort">
										<Icon name="chevron-expand" />
									</span>
								</th>

								<th>
									{token1 && token1.symbol} / {token2 && token2.symbol}
									<span className="transactions__sort">
										<Icon name="chevron-expand" />
									</span>
								</th>
							</tr>
						</thead>

						{!userFilledOrders || userFilledOrders.length === 0 ? (
							<caption className="transactions__no-order-warning">No Filled Orders!</caption>
						) : (
							<tbody>
								{userFilledOrders &&
									userFilledOrders.map((order: OrderType, index: string | number) => (
										<tr key={index}>
											<td className="timestamp">{order.formattedTimestamp}</td>
											<td className={`tokenAmount ${order.orderTypeClass}`}>
												{order.orderTypeSign}
												{order.token1Amount}
											</td>
											<td className="tokenPrice">{order.tokenPrice}</td>
										</tr>
									))}
							</tbody>
						)}
					</table>
				)}
			</div>
		</section>
	);
};

export default Transactions;
