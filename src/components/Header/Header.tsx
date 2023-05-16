import { FC, ReactElement, useState } from "react";
import { useAppSelector } from "../../app/hooks";

import { Link } from "react-router-dom";

import classNames from "classnames";

import { Icon } from "..";
import "./Header.css";

enum Tabs {
	SWAP,
	TRADE,
}

const Header: FC = (): ReactElement => {
	// Get the current account address
	const account = useAppSelector((state) => state.connection.current?.account);

	// It only shows a few parts of the whole address
	const accountAddress = `${account?.substring(0, 6)}...${account?.substring(38, 42)}`;

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

			<div className="Header__connection">
				<div className="Header__networks">
					<div className="Header__network">
						<button className="Header__network-btn">
							<i className="Header__network-icon fa-brands fa-ethereum"></i>
							<span>Ethereum</span>
							<Icon name="chevron-down-outline" />
						</button>
					</div>
				</div>
				<div className="Header__account">
					<button className="Header__account-btn" title={account ? account : "Please connect your wallet!"}>
						{account ? <Icon name="person" /> : <Icon name="wallet" />}
						<p className="Header__account-address">{account ? accountAddress : "Connect"}</p>
					</button>
				</div>
				<div className="Header__settings">
					<Link to="/settings">
						<Icon name="settings-outline" />
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
