import { useState } from "react";
import TradeRectangle from "../../assets/images/trade-rectangle.svg";

import { Icon } from "..";

import "./Trade.css";

enum Status {
	WITHDRAW,
	DEPOSIT,
}

const Trade = () => {
	const [exchangeStatus, setExchangeStatus] = useState(Status.WITHDRAW);

	const onExchangeStatusClicked = () => {
		setExchangeStatus((prevStatus) => (prevStatus === Status.WITHDRAW ? Status.DEPOSIT : Status.WITHDRAW));
	};

	return (
		<div className="Trade">
			<div className="container">
				<div className="Trade__container">
					<section className="Trade__exchange">
						<img src={TradeRectangle} alt="trade-rectangle" />

						<menu className="Trade__markets">
							<span className="Trade__markets-label">Market</span>
						</menu>

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
