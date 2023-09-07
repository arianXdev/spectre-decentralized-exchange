import { useContext, useEffect, ChangeEvent } from "react";
import { useImmer } from "use-immer";

import { useAppSelector, useAppDispatch } from "~/state/hooks";

import useFetchGasPrice from "~/hooks/useFetchGasPrice";

import { EthersContext, ExchangeContext, TokensContext, TradeContext } from "~/context";

import { loadBalances, transferTokens } from "~/utils";

import SPECLogo from "~/assets/images/spectre-logo-light.png";
import ETHPreloader from "~/assets/preloaders/eth-preloader.gif";
import { Icon } from "..";

import { toast, ErrorIcon } from "react-hot-toast";

import "./Balance.scss";

interface TokenType {
	name: string;
	address: string;
	symbol: string;
	balance: string;
	decimals: number;
	imageURL: string;
}

enum Status {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

const Balance = () => {
	// ATTENTION: IT IS TEMPORARY!
	const GAS_FEE_STATUS = import.meta.env.VITE_GAS_FEE_STATUS;

	const dispatch = useAppDispatch();

	const { gasFee, transactionFee, fetchGasPrice } = useFetchGasPrice();

	const { provider } = useContext(EthersContext);
	const { status, handleExchangeMarkets } = useContext(TradeContext);
	const { exchange } = useContext(ExchangeContext);
	const { tokens } = useContext(TokensContext);

	const token1 = useAppSelector(({ tokens }) => tokens.token1);
	const token2 = useAppSelector(({ tokens }) => tokens.token2);
	const account = useAppSelector(({ connection }) => connection.current?.account);

	const exchangeBalances = useAppSelector(({ exchange }) => exchange.balances);

	// the current transfer status
	const transferInProgress = useAppSelector(({ exchange }) => exchange.transferInProgress);

	// Inputs values
	const [token1TransferAmount, setToken1TransferAmount] = useImmer<string>("");
	const [token2TransferAmount, setToken2TransferAmount] = useImmer<string>("");

	// an event handler to handle the user input
	const handleAmount = (e: ChangeEvent<HTMLInputElement>, token: TokenType) => {
		if (token.address === token1?.address) {
			Number(e.target.value) >= 0 ? setToken1TransferAmount(e.target.value) : setToken1TransferAmount("");
		} else if (token.address === token2?.address) {
			Number(e.target.value) >= 0 ? setToken2TransferAmount(e.target.value) : setToken2TransferAmount("");
		}
	};

	enum TransferType {
		WITHDRAW = "Withdraw",
		DEPOSIT = "Deposit",
	}

	// an event handler when the user clicks the DEPOSIT button
	const handleDeposit = (e: ChangeEvent<HTMLInputElement>, token: TokenType) => {
		e.preventDefault();

		if (account) {
			if (token1TransferAmount !== "" || token2TransferAmount !== "") {
				if (token.address === token1?.address && Number(token1TransferAmount) !== 0 && Number(token1TransferAmount) > 0)
					transferTokens(
						provider,
						exchange,
						TransferType.DEPOSIT,
						tokens[token1?.symbol].contract,
						token1TransferAmount,
						dispatch
					);
				else if (token.address === token2?.address && Number(token2TransferAmount) !== 0 && Number(token2TransferAmount) > 0)
					transferTokens(
						provider,
						exchange,
						TransferType.DEPOSIT,
						tokens[token2?.symbol].contract,
						token2TransferAmount,
						dispatch
					);
				else
					toast.error("Oops! It looks like the amount you entered is invalid. Please ensure it is accurate before proceeding.", {
						duration: 5500,
						icon: <ErrorIcon />,
					});
			}
		} else {
			toast("Please connect your wallet!", { icon: <Icon name="alert" /> });
		}
	};

	// an event handler when the user clicks the WITHDRAW button
	const handleWithdraw = (e: ChangeEvent<HTMLInputElement>, token: TokenType) => {
		e.preventDefault();

		if (account) {
			if (token1TransferAmount !== "" || token2TransferAmount !== "") {
				if (token.address === token1?.address && Number(token1TransferAmount) !== 0 && Number(token1TransferAmount) > 0)
					transferTokens(
						provider,
						exchange,
						TransferType.WITHDRAW,
						tokens[token1?.symbol].contract,
						token1TransferAmount,
						dispatch
					);
				else if (token.address === token2?.address && Number(token2TransferAmount) !== 0 && Number(token2TransferAmount) > 0)
					transferTokens(
						provider,
						exchange,
						TransferType.WITHDRAW,
						tokens[token2?.symbol].contract,
						token2TransferAmount,
						dispatch
					);
				else
					toast.error("Oops! It looks like the amount you entered is invalid. Please ensure it is accurate before proceeding.", {
						duration: 5500,
						icon: <ErrorIcon />,
					});
			}
		} else {
			toast("Please connect your wallet!", { icon: <Icon name="alert" /> });
		}
	};

	// clear out all the amount inputs
	const clearAmountInputs = () => {
		if (!transferInProgress) {
			setToken1TransferAmount("");
			setToken2TransferAmount("");
		}
	};

	useEffect(() => {
		if (exchange && account && tokens && token1 && token2)
			loadBalances(exchange, [tokens[token1?.symbol].contract, tokens[token2?.symbol].contract], account, dispatch);

		// clear out all the amount inputs after the transaction is done (whether successful or failed)
		clearAmountInputs();
	}, [exchange, account, tokens, token1, token2, transferInProgress, dispatch]);

	return (
		<section className="balance">
			<div className={`balance__info ${!gasFee ? "error" : ""}`}>
				<h3 className="balance__title">Trade / Balance</h3>
				{GAS_FEE_STATUS === "true" ? (
					<h3 className="balance__fee" title="Click to update!" onClick={fetchGasPrice}>
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
				) : null}
			</div>

			<div className="balance__transfers">
				<div className={`balance__form ${status.toLowerCase()}`}>
					<article className="balance__token" title={token1?.symbol} onClick={handleExchangeMarkets}>
						<img className="balance__token-img" src={token1?.imageURL ?? ETHPreloader} alt={token1?.name} />
						<h3 className="balance__token-name">{token1?.symbol ?? "SPEC"}</h3>
					</article>

					<form
						onSubmit={status === Status.DEPOSIT ? (e) => handleDeposit(e, token1) : (e) => handleWithdraw(e, token1)}
						noValidate
					>
						<label className="balance__label" htmlFor="token1">
							{token1 && token1.symbol} AMOUNT
						</label>
						<input
							className="balance__input"
							type="number"
							id="token1"
							name="token1"
							tabIndex={1}
							placeholder="0.0000"
							value={token1TransferAmount}
							onChange={(e) => handleAmount(e, token1)}
						/>
						<button className={`balance__btn balance__btn--${status.toLowerCase()}`} type="submit">
							<span>{status === Status.WITHDRAW ? Status.WITHDRAW : Status.DEPOSIT}</span>
							<Icon name="chevron-forward-outline" />
						</button>
					</form>

					{account ? (
						<div className="balance__amounts">
							<h4 className="balance__exchange" title="Exchange Balance">
								<img src={SPECLogo} alt="SPEC" />
								<small>{(exchangeBalances && parseFloat(exchangeBalances.token1))?.toFixed(2) || 0}</small>
								<strong>{token1?.symbol || ""}</strong>
							</h4>
							<span></span>
							<h4 className="balance__wallet" title="Wallet Balance">
								<Icon name="wallet-outline" />
								<small>{(token1 && parseFloat(token1?.balance))?.toFixed(2) || 0}</small>
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

					<form
						onSubmit={status === Status.DEPOSIT ? (e) => handleDeposit(e, token2) : (e) => handleWithdraw(e, token2)}
						noValidate
					>
						<label className="balance__label" htmlFor="token2">
							{token2 && token2.symbol} AMOUNT
						</label>
						<input
							className="balance__input"
							type="number"
							name="token2"
							id="token2"
							tabIndex={2}
							placeholder="0.0000"
							value={token2TransferAmount}
							onChange={(e) => handleAmount(e, token2)}
						/>
						<button className={`balance__btn balance__btn--${status.toLowerCase()}`} type="submit">
							<span>{status === Status.WITHDRAW ? Status.WITHDRAW : Status.DEPOSIT}</span>
							<Icon name="chevron-forward-outline" />
						</button>
					</form>

					{account ? (
						<div className="balance__amounts">
							<h4 className="balance__exchange" title="Exchange Balance">
								<img src={SPECLogo} alt="SPEC" />
								<small>{(exchangeBalances && parseFloat(exchangeBalances.token2))?.toFixed(2) || 0}</small>
								<strong>{token2?.symbol || ""}</strong>
							</h4>
							<span></span>
							<h4 className="balance__wallet" title="Wallet Balance">
								<Icon name="wallet-outline" />
								<small>{(token2 && parseFloat(token2?.balance))?.toFixed(2) || 0}</small>
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
