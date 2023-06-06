import { useState } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "~/app/hooks";

import TradeRectangle from "../../assets/images/trade-rectangle.svg";

import config from "../../config.json";

import { Markets, Overlay, Icon } from "..";

import "./Trade.css";

enum Status {
	WITHDRAW,
	DEPOSIT,
}

const Trade = () => {
	const [exchangeStatus, setExchangeStatus] = useState(Status.WITHDRAW);
	const [isMarketsModalOpen, setIsMarketsModalOpen] = useState(false);

	// Get the current connection's chainId from the Redux store
	const chainId = useAppSelector(({ connection }) => connection.current?.chainId ?? 1);

	enum MarketsList {
		SPEC_mETH = `${config[chainId].spectre.address} ${config[chainId].mETH.address}`,
		SPEC_mDAI = `${config[chainId].spectre.address} ${config[chainId].mDAI.address}`,
		SPEC_mUSDT = `${config[chainId].spectre.address} ${config[chainId].mUSDT.address}`,
		mDAI_mETH = `${config[chainId].mDAI.address} ${config[chainId].mETH.address}`,
		mUSDT_mETH = `${config[chainId].mUSDT.address} ${config[chainId].mETH.address}`,
	}

	const onExchangeStatusClicked = () => {
		setExchangeStatus((prevStatus) => (prevStatus === Status.WITHDRAW ? Status.DEPOSIT : Status.WITHDRAW));
	};

	const onExchangeMarketsClicked = () => setIsMarketsModalOpen(!isMarketsModalOpen);

	return (
		<div className="Trade">
			<div className="container">
				<div className="Trade__container">
					<section className="Trade__exchange">
						<img src={TradeRectangle} alt="trade-rectangle" />

						<menu className="Trade__markets" onClick={onExchangeMarketsClicked}>
							<span className="Trade__markets-label">Market</span>
						</menu>

						{createPortal(
							<>
								<Markets isOpen={isMarketsModalOpen} setIsOpen={setIsMarketsModalOpen} MarketsList={MarketsList} />
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
					</section>
				</div>
			</div>
		</div>
	);
};

export default Trade;
