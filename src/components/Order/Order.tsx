import { useState } from "react";

import classNames from "classnames";
import { Icon } from "..";

import "./Order.scss";

enum Tabs {
	BUY = "buy",
	SELL = "sell",
}

const Order = () => {
	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.BUY);

	const orderBuyTabClass = classNames({
		order__tab: true,
		"order__tab--buy": true,
		"order__tab--active": activeTab === Tabs.BUY,
	});

	const orderSellTabClass = classNames({
		order__tab: true,
		"order__tab--sell": true,
		"order__tab--active": activeTab === Tabs.SELL,
	});

	return (
		<section className="order">
			<div className="order__header">
				<h2 className="order__title">New Order</h2>
				<div className="order__tabs">
					<button className={orderBuyTabClass} onClick={() => setActiveTab(Tabs.BUY)}>
						Buy
					</button>
					<button className={orderSellTabClass} onClick={() => setActiveTab(Tabs.SELL)}>
						Sell
					</button>
				</div>
			</div>

			<form className={`order__form ${activeTab === Tabs.BUY ? "buy" : "sell"}`} noValidate>
				<div className="order__form-group">
					<label className="order__label" htmlFor="amount">
						{activeTab === Tabs.BUY ? "Buy" : "Sell"} AMOUNT
					</label>
					<input
						className="order__input order__input--amount"
						type="number"
						name="amount"
						tabIndex={3}
						placeholder="0.0000"
						autoComplete="off"
					/>
				</div>

				<div className="order__form-group">
					<label className="order__label" htmlFor="price">
						{activeTab === Tabs.BUY ? "Buy" : "Sell"} PRICE
					</label>
					<input
						className="order__input order__input--price"
						type="number"
						name="price"
						tabIndex={4}
						placeholder="$0.00"
						autoComplete="off"
					/>
				</div>

				<button className={`order__btn ${activeTab === Tabs.BUY ? "order__btn--buy" : "order__btn--sell"}`} type="submit">
					<span>{activeTab === Tabs.BUY ? "Buy" : "Sell"} Order</span>
					<Icon name="chevron-forward-outline" />
				</button>
			</form>

			<div className="order__info">
				<Icon name="information-circle-sharp" />
				<p>1 ETH = 0.0768 SPEC</p>
				<strong>($1,339.90)</strong>
			</div>
		</section>
	);
};

export default Order;
