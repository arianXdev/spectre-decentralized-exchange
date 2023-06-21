import { FC, useEffect, useRef, useContext } from "react";

import { useAppDispatch } from "~/app/hooks";
import { loadTokens } from "~/utils";

import { EthersContext } from "~/context/EthersContext";

import cryptosLogo from "~/helpers/cryptosLogo";
import Typed from "typed.js";

import { Icon } from "..";

import "./Markets.scss";

interface MarketsProps {
	isOpen: boolean;
	setIsOpen: (func: (state: boolean) => void | boolean) => void;
	MarketsList: unknown;
	setMarket: (a: string) => void;
}

const Markets: FC<MarketsProps> = ({ isOpen, setIsOpen, MarketsList, setMarket }) => {
	const dispatch = useAppDispatch();
	const { provider } = useContext(EthersContext);

	const marketsTitleRef = useRef(null);
	const marketsRef = useRef(null);

	const handleSelectMarket = async (market: string) => {
		setMarket(market);

		// load those two token pairs that are needed
		const addresses = market.split(",");
		await loadTokens(provider, addresses, dispatch);

		// Close the Markets modal after the user chose the market
		setIsOpen(false);
	};

	useEffect(() => {
		const marketsTitleTyped = new Typed(marketsTitleRef.current, {
			strings: ["<i>Select A Market</i>"],
			typeSpeed: 80,
			showCursor: false,
		});

		return () => {
			marketsTitleTyped.destroy();
		};
	}, [isOpen]);

	const handleOutsideClick = (event: MouseEvent) => {
		if (event.target === marketsRef.current) {
			setIsOpen((prevState) => !prevState);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<section className={`markets ${isOpen ? "open" : ""}`} ref={marketsRef}>
			<div className={`markets__wrapper ${isOpen ? "open" : ""}`}>
				<div className="markets__title">
					<Icon name="cash-outline" />
					<h3 ref={marketsTitleRef}>Select A Market</h3>
				</div>

				<div className="markets__container">
					<div className="markets__body">
						<ul className="markets__list">
							<li className="markets__item" onClick={() => handleSelectMarket(MarketsList.SPEC_mETH)}>
								<div className="markets__item-right">
									<img className="markets__icon" src={cryptosLogo.SPEC} alt="SPEC" />
									<i>SPEC</i>
								</div>

								<div className="markets__item-left">
									<img className="markets__icon" src={cryptosLogo.mETH} alt="ETH" />
									<i>mETH</i>
								</div>
							</li>
							<li className="markets__item" onClick={() => handleSelectMarket(MarketsList.SPEC_mDAI)}>
								<div className="markets__item-right">
									<img className="markets__icon" src={cryptosLogo.SPEC} alt="SPEC" />
									<i>SPEC</i>
								</div>

								<div className="markets__item-left">
									<img className="markets__icon" src={cryptosLogo.mDAI} alt="DAI" />
									<i>mDAI</i>
								</div>
							</li>
							<li className="markets__item" onClick={() => handleSelectMarket(MarketsList.SPEC_mUSDT)}>
								<div className="markets__item-right">
									<img className="markets__icon" src={cryptosLogo.SPEC} alt="SPEC" />
									<i>SPEC</i>
								</div>
								<div className="markets__item-left">
									<img className="markets__icon" src={cryptosLogo.mUSDT} alt="USDT" />
									<i>mUSDT</i>
								</div>
							</li>
							<li className="markets__item" onClick={() => handleSelectMarket(MarketsList.mDAI_mETH)}>
								<div className="markets__item-right">
									<img className="markets__icon" src={cryptosLogo.mDAI} alt="DAI" />
									<i>mDAI</i>
								</div>
								<div className="markets__item-left">
									<img className="markets__icon" src={cryptosLogo.mETH} alt="ETH" />
									<i>mETH</i>
								</div>
							</li>
							<li className="markets__item" onClick={() => handleSelectMarket(MarketsList.mUSDT_mETH)}>
								<div className="markets__item-right">
									<img className="markets__icon" src={cryptosLogo.mUSDT} alt="USDT" />
									<i>mUSDT</i>
								</div>
								<div className="markets__item-left">
									<img className="markets__icon" src={cryptosLogo.mETH} alt="ETH" />
									<i>mETH</i>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Markets;
