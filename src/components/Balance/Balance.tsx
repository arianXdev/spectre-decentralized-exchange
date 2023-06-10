import { useContext, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "~/app/hooks";

import useFetchGasPrice from "~/hooks/useFetchGasPrice";
import { ExchangeContext } from "~/context/ExchangeContext";
import { TokensContext } from "~/context/TokensContext";
import { TradeContext } from "~/context/TradeContext";

import { loadBalances } from "~/app/interactions";

import SPECLogo from "~/assets/images/spectre-logo-light.png";
import ETHPreloader from "~/assets/images/preloaders/eth-preloader.gif";
import { Icon } from "..";

import "./Balance.css";

enum Status {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

const Balance = () => {
	const { gasFee, transactionFee, fetchGasPrice } = useFetchGasPrice();

	const { status, handleExchangeMarkets } = useContext(TradeContext);
	const { exchange } = useContext(ExchangeContext);
	const { tokens } = useContext(TokensContext);

	const dispatch = useAppDispatch();

	const token1 = useAppSelector(({ tokens }) => tokens.token1);
	const token2 = useAppSelector(({ tokens }) => tokens.token2);
	const account = useAppSelector(({ connection }) => connection.current?.account);

	const exchangeBalances = useAppSelector(({ exchange }) => exchange.balances);

	useEffect(() => {
		if (exchange && account && tokens && token1 && token2)
			loadBalances(exchange, [tokens[token1?.symbol].contract, tokens[token2?.symbol].contract], account, dispatch);
	}, [exchange, account, tokens, token1, token2, dispatch]);

	return (
		<section className="balance">
			<div className={`balance__info ${!gasFee ? "error" : ""}`}>
				<h3 className="balance__title">Trade / Balance</h3>
				<h3 className="balance__fee" onClick={fetchGasPrice} title="Click to update!">
					{gasFee && window.navigator.onLine ? (
						<>
							<i className="fa-solid fa-gas-pump"></i>
							<small>{gasFee.toFixed(0)}</small>
							<b>GWEI</b>
							<i>/</i>
							<strong>${transactionFee.toFixed(2)}</strong>
						</>
					) : (
						<span className="balance__error">
							{window.navigator.onLine ? "Loading, please wait..." : "Couldn't load the fees!"}
						</span>
					)}
				</h3>
			</div>

			<div className="balance__transfers">
				<div className={`balance__form ${status.toLowerCase()}`}>
					<article className="balance__token" title={token1?.symbol} onClick={handleExchangeMarkets}>
						<img className="balance__token-img" src={token1?.imageURL ?? ETHPreloader} alt={token1?.name} />
						<h3 className="balance__token-name">{token1?.symbol ?? "SPEC"}</h3>
					</article>

					<form>
						<label className="balance__label" htmlFor="token1">
							AMOUNT
						</label>
						<input className="balance__input" type="number" name="token1" placeholder="0.0000" />
						<button className={`balance__btn balance__btn--${status.toLowerCase()}`} type="button">
							<span>{status === Status.WITHDRAW ? Status.WITHDRAW : Status.DEPOSIT}</span>
							<Icon name="chevron-forward-outline" />
						</button>
					</form>

					{account ? (
						<div className="balance__amounts">
							<h4 className="balance__exchange" title="Exchange Balance">
								<img src={SPECLogo} alt="SPEC" />
								<small>{(exchangeBalances && parseFloat(exchangeBalances.token1)) || 0}</small>
								<strong>{token1?.symbol || ""}</strong>
							</h4>
							<span></span>
							<h4 className="balance__wallet" title="Wallet Balance">
								<Icon name="wallet-outline" />
								<small>{(token1 && parseFloat(token1?.balance)) || 0}</small>
								<strong>{token1?.symbol || ""}</strong>
							</h4>
						</div>
					) : null}
				</div>

				<div className="divider"></div>

				<div className={`balance__form ${status.toLowerCase()}`}>
					<article className="balance__token" title={token2?.symbol} onClick={handleExchangeMarkets}>
						<img className="balance__token-img" src={token2?.imageURL ?? ETHPreloader} alt={token2?.name} />
						<h3 className="balance__token-name">{token2?.symbol ?? "mETH"}</h3>
					</article>

					<form>
						<label className="balance__label" htmlFor="token2">
							AMOUNT
						</label>
						<input className="balance__input" type="number" name="token2" placeholder="0.0000" />
						<button className={`balance__btn balance__btn--${status.toLowerCase()}`} type="button">
							<span>{status === Status.WITHDRAW ? Status.WITHDRAW : Status.DEPOSIT}</span>
							<Icon name="chevron-forward-outline" />
						</button>
					</form>

					{account ? (
						<div className="balance__amounts">
							<h4 className="balance__exchange" title="Exchange Balance">
								<img src={SPECLogo} alt="SPEC" />
								<small>{(exchangeBalances && parseFloat(exchangeBalances.token2)) || 0}</small>
								<strong>{token2?.symbol || ""}</strong>
							</h4>
							<span></span>
							<h4 className="balance__wallet" title="Wallet Balance">
								<Icon name="wallet-outline" />
								<small>{(token2 && parseFloat(token2?.balance)) || 0}</small>
								<strong>{token2?.symbol || ""}</strong>
							</h4>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
};

export default Balance;
