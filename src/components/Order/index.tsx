import { useState, useContext, useEffect, FormEvent } from "react";
import { useImmer } from "use-immer";

import { useAppDispatch, useAppSelector } from "~/state/hooks";
import { EthersContext, ExchangeContext, ExchangeType, TokensContext } from "~/context";
import { fillOrder, makeBuyOrder, makeSellOrder } from "~/utils";

import { toast } from "react-hot-toast";
import { ethers } from "ethers";

import classNames from "classnames";
import { Icon } from "..";

import "./Order.scss";

enum Tabs {
	BUY = "buy",
	SELL = "sell",
}

enum Status {
	NEW_ORDER,
	FILL_ORDER,
}

const Order = () => {
	const dispatch = useAppDispatch();

	const [orderStatus, setOrderStatus] = useState<Status>(Status.NEW_ORDER);
	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.BUY);
	const [disabledTab, setDisabledTab] = useState<Tabs | null>(null);

	const [amount, setAmount] = useImmer<string>("");
	const [price, setPrice] = useImmer<string>("");

	const { provider } = useContext(EthersContext);
	const { exchange } = useContext(ExchangeContext);
	const { tokens } = useContext(TokensContext);

	const account = useAppSelector(({ connection }) => connection.current?.account);

	// tokens
	const token1 = useAppSelector(({ tokens }) => tokens.token1);
	const token2 = useAppSelector(({ tokens }) => tokens.token2);

	const transaction = useAppSelector(({ exchange }) => exchange.transaction);

	// the current order trx status
	const isOrderInProgress = useAppSelector(({ exchange }) => exchange.isOrderInProgress);
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
					if (orderStatus === Status.NEW_ORDER) {
						const order = { amount, price };
						makeBuyOrder(
							provider,
							exchange as ExchangeType,
							[tokens[token1?.symbol].contract, tokens[token2?.symbol].contract] as Array<ethers.Contract>,
							order,
							dispatch
						);
					} else if (orderStatus === Status.FILL_ORDER) {
						fillOrder(orderInProgress, provider, exchange as ExchangeType, dispatch);
					}
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
					if (orderStatus === Status.NEW_ORDER) {
						const order = { amount, price };
						makeSellOrder(
							provider,
							exchange as ExchangeType,
							[tokens[token1?.symbol].contract, tokens[token2?.symbol].contract] as Array<ethers.Contract>,
							order,
							dispatch
						);
					} else if (orderStatus === Status.FILL_ORDER) {
						fillOrder(orderInProgress, provider, exchange as ExchangeType, dispatch);
					}
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
		if (!isOrderInProgress) {
			setAmount("");
			setPrice("");
		}
	};

	useEffect(() => {
		if (transaction?.transactionType === "FILL ORDER" && transaction?.isPending === true && isOrderInProgress === true) {
			setOrderStatus(Status.FILL_ORDER);

			if (orderInProgress.orderFillAction === "SELL") {
				setActiveTab(Tabs.SELL);
				setAmount(String(orderInProgress.token1Amount));
				setPrice(String(orderInProgress.tokenPrice));
				setDisabledTab(Tabs.BUY);
			} else {
				setActiveTab(Tabs.BUY);
				setAmount(String(orderInProgress.token1Amount));
				setPrice(String(orderInProgress.tokenPrice));
				setDisabledTab(Tabs.SELL);
			}
		}
	}, [orderInProgress]);
	useEffect(() => {
		clearOrderInputs();
	}, [isOrderInProgress]);

	useEffect(() => {
		if (amount === "" && price === "") {
			setOrderStatus(Status.NEW_ORDER);
			setDisabledTab(null);
		}
	}, [amount, price]);

	return (
		<section className="order">
			<div className="order__header">
				<h2 className="order__title">{orderStatus === Status.NEW_ORDER ? "New Order" : "Fill Order"}</h2>
				<div className="order__tabs">
					<button
						className={orderBuyTabClass}
						onClick={() => setActiveTab(Tabs.BUY)}
						disabled={disabledTab === Tabs.BUY ? true : false}
					>
						Buy
					</button>
					<button
						className={orderSellTabClass}
						onClick={() => setActiveTab(Tabs.SELL)}
						disabled={disabledTab === Tabs.SELL ? true : false}
					>
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
