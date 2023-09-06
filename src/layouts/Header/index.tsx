import { FC, ReactElement, useEffect, useRef, useState, useContext } from "react";
import { useAppSelector, useAppDispatch } from "~/state/hooks";

import { EthersContext } from "~/context/EthersContext";

import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

import { loadConnection } from "~/utils";

import Logo from "~/assets/images/spectre-logo-light.png";

import { AccountMenu, ConnectWallet } from "../../components";
import { Icon } from "../../components";

import { toast, ErrorIcon, CheckmarkIcon } from "react-hot-toast";

import "./Header.scss";

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

enum IsConnectingStatus {
	CONNECTING,
	SUCCESSFUL,
	REJECTED,
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
		"Header__tab--settings-activated": pathname === "/settings",
	});

	const headerTradeTabClass = classNames({
		Header__tab: true,
		"Header__tab--trade": true,
		"Header__tab--active": activeTab === Tabs.TRADE,
		"Header__tab--settings-activated": pathname === "/settings",
	});

	// Account Menu state
	const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

	// Connect Wallet display state
	const [isConnectWalletOpen, setIsConnectWalletOpen] = useState(false);

	// Is Wallet Connecting
	const [isWalletConnecting, setIsWalletConnecting] = useState(false);
	const [walletConnectingStatus, setWalletConnectingStatus] = useState(IsConnectingStatus.CONNECTING);

	const handleAccountMenuToggle = () => (account ? setIsAccountMenuOpen(!isAccountMenuOpen) : null);
	const handleConnectWalletToggle = async () =>
		window.ethereum._state.accounts.length === 0 || window.ethereum._state.accounts !== null
			? setIsConnectWalletOpen(!isConnectWalletOpen)
			: await loadConnection(provider, dispatch);

	// When the user clicks on MetaMask wallet button, then handleMetaMaskWallet will be called
	const handleMetaMaskWallet = async () => {
		// load connections & save the current connection information in the store
		setIsWalletConnecting(true);
		setWalletConnectingStatus(IsConnectingStatus.CONNECTING);
		try {
			await loadConnection(provider, dispatch)
				.then(() => {
					setWalletConnectingStatus(IsConnectingStatus.SUCCESSFUL);

					setTimeout(() => {
						setIsWalletConnecting(false);
						setIsConnectWalletOpen(false);
					}, 3000);
				})
				.catch((err) => {
					setWalletConnectingStatus(IsConnectingStatus.REJECTED);
					console.log(err);

					setTimeout(() => {
						setIsWalletConnecting(false);
					}, 5000);
				});
		} catch (err) {
			setWalletConnectingStatus(IsConnectingStatus.REJECTED);
		}
	};

	const onNetworkChanged = async (network: Networks) => {
		setShowNetworkMenu(false);

		if (network !== selectedNetwork) {
			// Get the chainId of the selected network by user
			const chainId = NetworksChainId[network];

			let toastApprove;
			// Send a request to MetaMask to change the network
			try {
				toastApprove = toast.loading("Please approve to switch the network...", {
					icon: <span className={`toast-spinner ${network ? "visible" : ""}`}></span>,
				});

				await window.ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId }],
				});

				toast.success("The page will reload in a sec...", { id: toastApprove, duration: 6000, icon: <CheckmarkIcon /> });
				setSelectedNetwork(network);
			} catch (err: unknown) {
				toast.error("Couldn't switch the network! - Please try again.", { id: toastApprove, duration: 4000, icon: <ErrorIcon /> });

				console.log(err);
			}
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
					<img src={Logo} alt="Spectre-DEX-logo" className="Header__img" />
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

			<div className={`Header__connection ${account ? "connected" : ""}`}>
				<div className="Header__networks">
					<div className="Header__network" ref={networkMenuRef}>
						<button
							onClick={() => setShowNetworkMenu(!showNetworkMenu)}
							className={`Header__network-btn ${showNetworkMenu ? "active" : ""}`}
						>
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
						onClick={account ? handleAccountMenuToggle : handleConnectWalletToggle}
						className={`Header__account-btn ${account ? "connected" : ""}`}
						title={account ? account : "Please connect your wallet!"}
					>
						{account ? <Icon name="person" /> : <Icon name="wallet" />}
						<p className="Header__account-address">{account ? accountAddress : "Connect"}</p>
					</button>

					<AccountMenu isOpen={isAccountMenuOpen} onClose={handleAccountMenuToggle} />
					<ConnectWallet
						isOpen={isConnectWalletOpen}
						onClose={handleConnectWalletToggle}
						status={walletConnectingStatus}
						isConnecting={isWalletConnecting}
						handleMetaMaskWallet={handleMetaMaskWallet}
					/>
				</div>
				<div className={pathname === "/settings" ? "Header__settings Header__settings--enabled" : "Header__settings"}>
					<Link to="/settings">
						<Icon name="settings-outline" />
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
