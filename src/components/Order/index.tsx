import { useState, useContext, useEffect, FormEvent } from "react";
import { useImmer } from "use-immer";

import { useAppDispatch, useAppSelector } from "~/state/hooks";
import { EthersContext, ExchangeContext, TokensContext } from "~/context";
import { makeBuyOrder, makeSellOrder } from "~/utils";

import { toast } from "react-hot-toast";

import classNames from "classnames";
import { Icon } from "..";

import "./Order.scss";

enum Tabs {
	BUY = "buy",
	SELL = "sell",
}

const Order = () => {
	const dispatch = useAppDispatch();

	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.BUY);

	const [amount, setAmount] = useImmer<string>("");
	const [price, setPrice] = useImmer<string>("");

	const { provider } = useContext(EthersContext);
	const { exchange } = useContext(ExchangeContext);
	const { tokens } = useContext(TokensContext);

	const account = useAppSelector(({ connection }) => connection.current?.account);

	// tokens
	const token1 = useAppSelector(({ tokens }) => tokens.token1);
	const token2 = useAppSelector(({ tokens }) => tokens.token2);

	// the current order trx status
	const orderInProgress = useAppSelector(({ exchange }) => exchange.orderInProgress);

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
	const handleBuyOrder = (e: FormEvent) => {
		e.preventDefault();

		if (account) {
			if (amount !== "" || price !== "") {
				if (Number(amount) !== 0 && Number(amount) > 0 && Number(price) !== 0 && Number(price) > 0) {
					const order = { amount, price };
					makeBuyOrder(provider, exchange, [tokens[token1?.symbol].contract, tokens[token2?.symbol].contract], order, dispatch);
				} else
					toast.error("Oops! It looks like the amount you entered is invalid. Please ensure it is accurate before proceeding.", {
						duration: 5500,
					});
			}
		} else {
			toast("Please connect your wallet!", { icon: <Icon name="alert" /> });
		}
	};

	// an Event Handler to handle sell orders
	const handleSellOrder = (e: FormEvent) => {
		e.preventDefault();

		if (account) {
			if (amount !== "" || price !== "") {
				if (Number(amount) !== 0 && Number(amount) > 0 && Number(price) !== 0 && Number(price) > 0) {
					const order = { amount, price };
					makeSellOrder(provider, exchange, [tokens[token1?.symbol].contract, tokens[token2?.symbol].contract], order, dispatch);
				} else
					toast.error("Oops! It looks like the amount you entered is invalid. Please ensure it is accurate before proceeding.", {
						duration: 5500,
					});
			}
		} else {
			toast("Please connect your wallet!", { icon: <Icon name="alert" /> });
		}
	};

	// clear out all the order inputs
	const clearOrderInputs = () => {
		if (!orderInProgress) {
			setAmount("");
			setPrice("");
		}
	};

	useEffect(() => {
		clearOrderInputs();
	}, [orderInProgress]);

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
						id="amount"
						tabIndex={3}
						placeholder="0.0000"
						autoComplete="off"
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value) >= 0 ? e.target.value : "")}
					/>
				</div>

				<div className="order__form-group order__form-group--price">
					<label className="order__label" htmlFor="price">
						{activeTab === Tabs.BUY ? "Buy" : "Sell"} PRICE
					</label>
					<input
						className="order__input order__input--price"
						type="number"
						name="price"
						id="price"
						tabIndex={4}
						placeholder="0.0000"
						autoComplete="off"
						value={price}
						onChange={(e) => setPrice(Number(e.target.value) >= 0 ? e.target.value : "")}
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
