import { useContext } from "react";

import { useAppSelector } from "~/app/hooks";

import useFetchGasPrice from "~/hooks/useFetchGasPrice";
import { TradeContext } from "~/context/TradeContext";

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

	const token1 = useAppSelector((state) => state.tokens.token1);
	const token2 = useAppSelector((state) => state.tokens.token2);

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
				</div>
			</div>
		</section>
	);
};

export default Balance;
