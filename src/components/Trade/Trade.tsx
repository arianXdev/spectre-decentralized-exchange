import { useState } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "~/app/hooks";

import { TradeContext } from "~/context/TradeContext";

import TradeRectangle from "../../assets/images/trade-rectangle.svg";

import config from "../../config.json";

import { Markets, Overlay, Balance } from "..";

import "./Trade.css";

enum Status {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

const Trade = () => {
	const [exchangeStatus, setExchangeStatus] = useState(Status.WITHDRAW);
	const [isMarketsModalOpen, setIsMarketsModalOpen] = useState(false);

	// Get the current connection's chainId from the Redux store
	const chainId = useAppSelector(({ connection }) => connection.current?.chainId ?? 1);

	enum MarketsList {
		SPEC_mETH = `${config[chainId].spectreToken.address},${config[chainId].mETH.address}`,
		SPEC_mDAI = `${config[chainId].spectreToken.address},${config[chainId].mDAI.address}`,
		SPEC_mUSDT = `${config[chainId].spectreToken.address},${config[chainId].mUSDT.address}`,
		mDAI_mETH = `${config[chainId].mDAI.address},${config[chainId].mETH.address}`,
		mUSDT_mETH = `${config[chainId].mUSDT.address},${config[chainId].mETH.address}`,
	}

	const [market, setMarket] = useState(MarketsList.SPEC_mETH);

	const onExchangeStatusClicked = () => {
		setExchangeStatus((prevStatus) => (prevStatus === Status.WITHDRAW ? Status.DEPOSIT : Status.WITHDRAW));
	};

	const onExchangeMarketsClicked = () => setIsMarketsModalOpen(!isMarketsModalOpen);

	return (
		<div className="Trade">
			<div className="container">
				<div className="Trade__container">
					<TradeContext.Provider value={{ status: exchangeStatus, handleExchangeMarkets: onExchangeMarketsClicked }}>
						<section className="Trade__exchange">
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
						</section>
					</TradeContext.Provider>
				</div>
			</div>
		</div>
	);
};

export default Trade;
