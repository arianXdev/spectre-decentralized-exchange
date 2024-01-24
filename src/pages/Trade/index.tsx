import { useState } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "~/state/hooks";

import { TradeContext } from "~/context";

import { Markets, Balance, Order, Overlay } from "~/components";
import { PriceChart, OrderBook, Trades, Transactions } from "~/layouts";

import TradeRectangle from "~/assets/images/trade-rectangle.svg";

import "./Trade.scss";

enum Status {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

const Trade = () => {
	const token1 = useAppSelector((state) => state.tokens?.token1);
	const token2 = useAppSelector((state) => state.tokens?.token2);

	const [exchangeStatus, setExchangeStatus] = useState<Status>(Status.WITHDRAW);
	const [isMarketsModalOpen, setIsMarketsModalOpen] = useState<boolean>(false);

	const onExchangeStatusClicked = () => {
		setExchangeStatus((prevStatus) => (prevStatus === Status.WITHDRAW ? Status.DEPOSIT : Status.WITHDRAW));
	};

	const onExchangeMarketsClicked = () => setIsMarketsModalOpen(!isMarketsModalOpen);

	return (
		<div className="Trade">
			<div className="container">
				<div className="Trade__wrapper">
					<TradeContext.Provider value={{ status: exchangeStatus, handleExchangeMarkets: onExchangeMarketsClicked }}>
						<section className="Trade__left">
							<img src={TradeRectangle} alt="trade-rectangle" />

							<menu className="Trade__markets" onClick={onExchangeMarketsClicked}>
								<span className="Trade__markets-label">Market</span>
								<h3 className="Trade__selected-market">
									{!token1 || !token2 ? (
										"Loading..."
									) : (
										<>
											{token1 && token1.symbol} / {token2 && token2.symbol}
										</>
									)}
								</h3>
							</menu>

							{createPortal(
								<>
									<Markets isOpen={isMarketsModalOpen} setIsOpen={setIsMarketsModalOpen} />
									<Overlay isOpen={isMarketsModalOpen} onClose={onExchangeMarketsClicked} />
								</>,
								document.getElementById("root") as HTMLBodyElement
							)}

							<div className="Trade__status" onClick={onExchangeStatusClicked}>
								<button
									className={`Trade__status-btn Trade__status-btn--deposit ${
										exchangeStatus === Status.DEPOSIT ? "Trade__status-btn--active" : "Trade__status-btn--non-active"
									}`}
								>
									Deposit
								</button>
								<button
									className={`Trade__status-btn Trade__status-btn--withdraw ${
										exchangeStatus === Status.WITHDRAW ? "Trade__status-btn--active" : "Trade__status-btn--non-active"
									}`}
								>
									Withdraw
								</button>
							</div>

							<Balance />

							<Order />
						</section>

						<section className="Trade__right">
							<PriceChart />
							<Transactions />
							<Trades />
							<OrderBook />
						</section>
					</TradeContext.Provider>
				</div>
			</div>
		</div>
	);
};

export default Trade;
