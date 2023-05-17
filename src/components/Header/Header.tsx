import { FC, ReactElement, useEffect, useRef, useState, useContext } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import { EthersContext } from "../../context/EthersContext";

import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

import { loadConnection } from "../../app/interactions";

import { AccountMenu } from "..";
import { Icon } from "..";

import "./Header.css";

enum Tabs {
	SWAP = "swap",
	TRADE = "trade",
}

enum Networks {
	Ethereum = "Ethereum",
	Sepolia = "Sepolia",
	Goerli = "Goerli",
	Localhost = "Localhost",
}

enum NetworksChainId {
	Ethereum = "0x1",
	Sepolia = "0xaa36a7",
	Goerli = "0x5",
	Localhost = "0x7a69", // Hardhat local network chainId in hexadecimal (31337)
}

const Header: FC = (): ReactElement => {
	// Get the provider
	const { provider } = useContext(EthersContext);

	const dispatch = useAppDispatch();

	// Get the current account address
	const account = useAppSelector((state) => state.connection.current?.account);

	// It only shows a few parts of the whole address
	const accountAddress = `${account?.substring(0, 6) || "0x000"}...${account?.substring(38, 42) || "0000"}`;

	const { pathname } = useLocation();

	const [activeTab, setActiveTab] = useState<Tabs>(Tabs.SWAP);
	const [showNetworkMenu, setShowNetworkMenu] = useState(false);
	const [selectedNetwork, setSelectedNetwork] = useState(Networks.Ethereum);

	const networkMenuRef = useRef<HTMLDivElement>(null);

	// get the network icon based on the selected network
	const getSelectedNetworkIcon = (): ReactElement => {
		if (selectedNetwork === Networks.Ethereum) return <i className="Header__network-icon fa-brands fa-ethereum"></i>;
		else if (selectedNetwork === Networks.Sepolia) return <i className="Header__network-icon fa-solid fa-s"></i>;
		else if (selectedNetwork === Networks.Goerli) return <i className="Header__network-icon fa-brands fa-gofore"></i>;
		else if (selectedNetwork === Networks.Localhost) return <i className="Header__network-icon fa-solid fa-server"></i>;
		else return <i className="Header__network-icon fa-brands fa-ethereum"></i>;
	};

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

	// Account Menu state
	const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

	const handleAccountMenuToggle = () => (account ? setIsAccountMenuOpen(!isAccountMenuOpen) : null);

	// When the user clicks on Connect button, then handleLoadAccount will be called
	const handleLoadAccount = async () => {
		// load connections & save the current connection information in the store
		await loadConnection(provider, dispatch);
	};

	const onNetworkChanged = async (network: Networks) => {
		setSelectedNetwork(network);
		setShowNetworkMenu(false);

		// Get the chainId of the selected network by user
		const chainId = NetworksChainId[network];

		// Send a request to MetaMask to change the network
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId }],
			});
		} catch (err: unknown) {
			console.log(err);
		}
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (networkMenuRef.current && !networkMenuRef.current.contains(event.target as Node)) {
			setShowNetworkMenu(false);
		}
	};

	// Get the current network's chain ID
	const chainId = useAppSelector((state) => `0x${state.connection.current?.chainId?.toString(16).toLowerCase()}`);

	useEffect(() => {
		// Check to see which network the user has selected
		if (chainId === NetworksChainId.Ethereum) setSelectedNetwork(Networks.Ethereum);
		else if (chainId === NetworksChainId.Goerli) setSelectedNetwork(Networks.Goerli);
		else if (chainId === NetworksChainId.Sepolia) setSelectedNetwork(Networks.Sepolia);
		else if (chainId === NetworksChainId.Localhost) setSelectedNetwork(Networks.Localhost);
	}, [account, chainId]);

	useEffect(() => {
		// Check the current URL to see which tabs is selected
		pathname !== "/" ? setActiveTab(pathname.substring(1) as Tabs) : null;
	}, [pathname]);

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<header className="Header">
			<div className="Header__logo">
				<Link to="/swap" className="Header__link">
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
					<div className="Header__network" ref={networkMenuRef}>
						<button onClick={() => setShowNetworkMenu(!showNetworkMenu)} className="Header__network-btn">
							{getSelectedNetworkIcon()}
							<span>{selectedNetwork}</span>
							<Icon name="chevron-down-outline" />
						</button>

						{showNetworkMenu ? (
							<div className="network-menu">
								<ul className="network-menu__list">
									<li
										className={
											selectedNetwork === Networks.Ethereum
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.Ethereum)}
									>
										<i className="network-menu__icon fa-brands fa-ethereum"></i> {Networks.Ethereum}
									</li>
									<li
										className={
											selectedNetwork === Networks.Sepolia
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.Sepolia)}
									>
										<i className="network-menu__icon fa-brands fa-s"></i> {Networks.Sepolia}
									</li>
									<li
										className={
											selectedNetwork === Networks.Goerli
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.Goerli)}
									>
										<i className="network-menu__icon fa-brands fa-gofore"></i> {Networks.Goerli}
									</li>
									<li
										className={
											selectedNetwork === Networks.Localhost
												? "network-menu__item network-menu__item--selected"
												: "network-menu__item"
										}
										onClick={() => onNetworkChanged(Networks.Localhost)}
									>
										<i className="network-menu__icon fa-solid fa-server"></i> {Networks.Localhost}
									</li>
								</ul>
							</div>
						) : null}
					</div>
				</div>
				<div className="Header__account">
					<button
						onClick={account ? handleAccountMenuToggle : handleLoadAccount}
						className="Header__account-btn"
						title={account ? account : "Please connect your wallet!"}
					>
						{account ? <Icon name="person" /> : <Icon name="wallet" />}
						<p className="Header__account-address">{account ? accountAddress : "Connect"}</p>
					</button>
					<AccountMenu isOpen={isAccountMenuOpen} onClose={handleAccountMenuToggle} />
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
