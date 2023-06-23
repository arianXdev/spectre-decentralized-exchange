import { useState, useContext } from "react";
import { useImmer } from "use-immer";

import classNames from "classnames";
import { Icon } from "..";

import { useAppDispatch, useAppSelector } from "~/app/hooks";

import { EthersContext } from "~/context/EthersContext";
import { ExchangeContext } from "~/context/ExchangeContext";
import { TokensContext } from "~/context/TokensContext";

import { makeBuyOrder, makeSellOrder } from "~/utils";

import "./Order.scss";

enum Tabs {
	BUY = "buy",
	SELL = "sell",
}

const Order = () => {
	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.BUY);

	const dispatch = useAppDispatch();

	const [amount, setAmount] = useImmer<string>("");
	const [price, setPrice] = useImmer<string>("");

	const { provider } = useContext(EthersContext);
	const { exchange } = useContext(ExchangeContext);
	const { tokens } = useContext(TokensContext);

	// tokens
	const token1 = useAppSelector(({ tokens }) => tokens.token1);
	const token2 = useAppSelector(({ tokens }) => tokens.token2);

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

	// an Event Handler to handle buy orders
	const handleBuyOrder = (e) => {
		e.preventDefault();

		const order = { amount, price };

		makeBuyOrder(provider, exchange, [tokens[token1?.symbol].contract, tokens[token2?.symbol].contract], order, dispatch);
	};

	// an Event Handler to handle sell orders
	const handleSellOrder = (e) => {
		e.preventDefault();

		const order = { amount, price };

		makeSellOrder(provider, exchange, [tokens[token1?.symbol].contract, tokens[token2?.symbol].contract], order, dispatch);
	};

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

			<form
				className={`order__form ${activeTab === Tabs.BUY ? "buy" : "sell"}`}
				onSubmit={activeTab === Tabs.BUY ? handleBuyOrder : handleSellOrder}
				noValidate
			>
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
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
				</div>

				<div className="order__form-group order__form-group--price">
					<label className="order__label" htmlFor="price">
						{activeTab === Tabs.BUY ? "Buy" : "Sell"} PRICE ($)
					</label>
					<input
						className="order__input order__input--price"
						type="number"
						name="price"
						tabIndex={4}
						placeholder="0.00"
						autoComplete="off"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
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
