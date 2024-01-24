import { useState, useEffect, useRef, useMemo, useContext, Dispatch, SetStateAction } from "react";
import { useImmer } from "use-immer";
import _ from "lodash";

import { useAppDispatch } from "~/state/hooks";
import { loadTokens } from "~/utils";
import { useAppSelector } from "~/state/hooks";

import { getMarketsList } from "~/data/MarketsList";
import cryptosLogo from "~/helpers/cryptosLogo";
import { EthersContext } from "~/context";

import Typed from "typed.js";
import { Icon } from "..";

import "./Markets.scss";

type MarketsProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const Markets = ({ isOpen, setIsOpen }: MarketsProps) => {
	const dispatch = useAppDispatch();
	const { provider } = useContext(EthersContext);

	const marketsTitleRef = useRef<HTMLHeadingElement>(null);
	const marketsRef = useRef<HTMLElement>(null);

	// Get the current connection's chainId from the Redux store
	const chainId = useAppSelector(({ connection }) => connection.current?.chainId ?? 11155111);

	// get markets list
	const MarketsList = useMemo(() => getMarketsList(chainId), [chainId, provider]);

	const [searchValue, setSearchValue] = useState("");
	const [filteredMarkets, setFilteredMarkets] = useImmer(MarketsList);

	const handleSelectMarket = async (market: any) => {
		// load those two token pairs that are needed
		const addresses = [market.token1.address, market.token2.address];
		await loadTokens(provider, addresses, dispatch);

		// Close the Markets modal after the user chose the market
		setIsOpen(false);

		setSearchValue("");
		setFilteredMarkets(MarketsList);
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (event.target === marketsRef.current) {
			setIsOpen((prevState) => !prevState);
			setSearchValue("");
			setFilteredMarkets(MarketsList);
		}
	};

	const handleMarketsSearch = (e: any) => {
		setSearchValue(e.target.value);

		setFilteredMarkets(
			MarketsList.filter(
				(market) =>
					market.token1.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
					market.token2.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
					market.token1.address.toLowerCase() === searchValue.toLowerCase() ||
					market.token2.address.toLowerCase() === searchValue.toLowerCase()
			)
		);

		if (e.target.value === "") setFilteredMarkets(MarketsList);
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
					<input
						type="text"
						className="markets__search"
						placeholder="Search name or paste address..."
						value={searchValue}
						onChange={handleMarketsSearch}
					/>

					<div className="markets__body">
						{filteredMarkets.length > 0 ? (
							<ul className="markets__list">
								{filteredMarkets.map((market, index) => (
									<li className="markets__item" onClick={() => handleSelectMarket(market)} key={index}>
										<div className="markets__item-right">
											<img
												className="markets__icon"
												src={cryptosLogo[market.token1.symbol]}
												alt={market.token1.symbol}
											/>
											<i>{market.token1.symbol}</i>
										</div>

										<div className="markets__item-left">
											<img
												className="markets__icon"
												src={cryptosLogo[market.token2.symbol]}
												alt={market.token2.symbol}
											/>
											<i>{market.token2.symbol}</i>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="markets__no-results">No results found!</p>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Markets;
