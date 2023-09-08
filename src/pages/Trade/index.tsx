import { useState } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "~/state/hooks";

import { TradeContext } from "~/context";
import deployed from "~/data/deployed.json";

import { Markets, Balance, Order, Overlay } from "~/components";
import { PriceChart, OrderBook, Trades } from "~/layouts";

import TradeRectangle from "~/assets/images/trade-rectangle.svg";

import "./Trade.scss";

enum Status {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

const Trade = () => {
	const [exchangeStatus, setExchangeStatus] = useState<Status>(Status.WITHDRAW);
	const [isMarketsModalOpen, setIsMarketsModalOpen] = useState<boolean>(false);

	// Get the current connection's chainId from the Redux store
	const chainId = useAppSelector(({ connection }) => connection.current?.chainId ?? 1);

	const currentNetwork = deployed[chainId];

	enum MarketsList {
		SPEC_mETH = `${currentNetwork.spectreToken.address},${currentNetwork.mETH.address}` as never,
		SPEC_mDAI = `${currentNetwork.spectreToken.address},${currentNetwork.mDAI.address}` as never,
		SPEC_mUSDT = `${currentNetwork.spectreToken.address},${currentNetwork.mUSDT.address}` as never,
		mDAI_mETH = `${currentNetwork.mDAI.address},${currentNetwork.mETH.address}` as never,
		mUSDT_mETH = `${currentNetwork.mUSDT.address},${currentNetwork.mETH.address}` as never,
	}

	const [market, setMarket] = useState<MarketsList>(MarketsList.SPEC_mETH);

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
								<h3 className="Trade__selected-market">{MarketsList[market].replace("_", " / ")}</h3>
							</menu>

							{createPortal(
								<>
									<Markets
										isOpen={isMarketsModalOpen}
										setIsOpen={setIsMarketsModalOpen}
										MarketsList={MarketsList}
										setMarket={setMarket}
									/>
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
