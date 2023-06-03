import TradeRectangle from "../../assets/images/trade-rectangle.svg";

import "./Trade.css";

const Trade = () => {
	return (
		<div className="Trade">
			<div className="container">
				<div className="Trade__container">
					<section className="Trade__exchange">
						<img src={TradeRectangle} alt="trade-rectangle" />

						<menu className="Trade__markets">
							<span className="Trade__markets-label">Market</span>
						</menu>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Trade;
