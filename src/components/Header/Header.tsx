import { FC, ReactElement, useState } from "react";

import { Link } from "react-router-dom";

import classNames from "classnames";

import "./Header.css";

enum Tabs {
	SWAP,
	TRADE,
}

const Header: FC = (): ReactElement => {
	const [activeTab, setActiveTab] = useState(Tabs.SWAP);

	const headerSwapTabClass = classNames({
		Header__tab: true,
		"Header__tab--swap": true,
		"Header__tab--active": activeTab === Tabs.SWAP,
	});

	const headerTradeTabClass = classNames({
		Header__tab: true,
		"Header__tab--trade": true,
		"Header__tab--active": activeTab === Tabs.TRADE,
	});

	return (
		<header className="Header">
			<div className="Header__logo">
				<Link to="/" className="Header__link">
					<img src="/src/assets/images/spectre-logo-light.png" alt="Spectre-DEX-logo" className="Header__img" />
					<h1 className="Header__title">Spectre</h1>
					<span className="Header__span">DEX</span>
				</Link>
			</div>

			<div className="Header__tabs-wrapper">
				<menu className="Header__tabs">
					<Link to="/swap" className={headerSwapTabClass} onClick={() => setActiveTab(Tabs.SWAP)}>
						Swap
					</Link>
					<Link to="/trade" className={headerTradeTabClass} onClick={() => setActiveTab(Tabs.TRADE)}>
						Trade
					</Link>
				</menu>
			</div>

			<div className="Header__connection">Header Connection stuff</div>
		</header>
	);
};

export default Header;
