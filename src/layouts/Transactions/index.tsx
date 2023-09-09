import { useState } from "react";

import classNames from "classnames";
import { Icon } from "~/components";

import "./Transactions.scss";

enum Tabs {
	ORDERS,
	TRADES,
}

const Transactions = () => {
	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.ORDERS);

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

	return (
		<section className="transactions">
			<div className="transactions__header">
				<h3 className="transactions__title">
					<Icon name="clipboard-outline" />
					<span>My Transactions</span>
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

			<div className="transactions__body"></div>
		</section>
	);
};

export default Transactions;
