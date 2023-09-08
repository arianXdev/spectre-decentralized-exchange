import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "~/state/hooks";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ethers } from "ethers";

import config from "~/config.json";

import { EthersContext, ExchangeContext, TokensContext } from "~/context";

import InstallWallet from "./InstallWallet";
import Trade from "./Trade";
import Settings from "./Settings";

import { Header } from "~/layouts";
import { Overlay } from "~/components";

import { loadConnection, loadTokens, loadExchange, loadAllOrders, loadFilledOrders, loadCanceledOrders, subscribeToEvents } from "~/utils";
import useMetaMask from "~/hooks/useMetaMask";

import { isMobile } from "react-device-detect";
import { Toaster } from "react-hot-toast";
import Typed from "typed.js";

import "./App.scss";

const App = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
	const [provider, setProvider] = useState<ethers.BrowserProvider>({} as ethers.BrowserProvider);
	const [exchange, setExchange] = useState<object>({});
	const [tokens, setTokens] = useState<any>({});

	const arianNameRef = useRef<HTMLHeadingElement>(null);

	const fetchBlockchain = async () => {
		if (!isMobile) window.ethereum._state.accounts = [];

		// the term "provider" in this case is our connection to the blockchain
		// eslint-disable-next-line
		const provider = new ethers.BrowserProvider(window.ethereum);
		setProvider(provider);

		const network = await provider.getNetwork();
		const chainId = String(network.chainId);

		const currentNetwork = config[chainId];

		// load connections & save the current connection information whenever the account has been changed
		useMetaMask().on("accountsChanged", async () => {
			await loadConnection(provider, dispatch);
		});

		// Reload the page when the user changed their network
		useMetaMask().on("chainChanged", () => window.location.reload());

		// Load all tokens contracts
		const { SPEC, mETH, mDAI, mUSDT } = await loadTokens(
			provider,
			[currentNetwork.spectreToken.address, currentNetwork.mETH.address],
			dispatch
		);

		// Save the contracts of all tokens in state & make it globally accessible across the entire app using context
		setTokens({
			SPEC: { symbol: "SPEC", contract: SPEC },
			mETH: { symbol: "mETH", contract: mETH },
			mDAI: { symbol: "mDAI", contract: mDAI },
			mUSDT: { symbol: "mUSDT", contract: mUSDT },
		});

		// Get the Spectre exchange contract
		const exchange = await loadExchange(provider, currentNetwork.spectre.address);
		setExchange(exchange);

		// Load the connection if the user has been connected already
		useMetaMask().selectedAddress ? await loadConnection(provider, dispatch) : null;

		// Fetch all the orders | OPEN - FILLED - CANCELLED
		loadAllOrders(provider, exchange, dispatch);

		// Fetch all the filled orders
		loadFilledOrders(provider, exchange, dispatch);

		// Fetch all the canceled orders
		loadCanceledOrders(provider, exchange, dispatch);

		// Listen to all events from the Blockchain
		subscribeToEvents(exchange, dispatch);
	};

	useEffect(() => {
		if (typeof window.ethereum === "undefined") {
			setIsMetaMaskInstalled(false);
		} else {
			// When the exchange runs, it's gonna get all the Blockchain data and contracts
			fetchBlockchain();
		}
	}, []);

	useEffect(() => {
		if (isMetaMaskInstalled && !isMobile && location.pathname === "/swap") {
			const arianNameTyped = new Typed(arianNameRef.current, {
				strings: [
					"Arian Hosseini",
					`<i style="font-family: $font-oxanium;font-size: 2.8rem">Blockchain Developer</i>`,
					`Arian Hosseini <i style="font-family: $font-oxanium;font-size: 2.2rem"> | Blockchain Developer</i>`,
					"Arian Hosseini",
				],
				typeSpeed: 100,
				fadeOut: true,
				startDelay: 3000,
				showCursor: false,
			});

			return () => {
				arianNameTyped.destroy();
			};
		}
	}, [location.pathname]);

	return (
		<EthersContext.Provider value={{ provider }}>
			<ExchangeContext.Provider value={{ exchange }}>
				<TokensContext.Provider value={{ tokens }}>
					{!isMetaMaskInstalled && !isMobile ? (
						<>
							<InstallWallet />
							<Overlay isOpen={true} />
						</>
					) : null}

					<>
						<div className="container">
							<Header />
						</div>

						<Toaster
							toastOptions={{
								className: "Toaster",
							}}
						/>

						<h2 className="arian-name" ref={arianNameRef}></h2>
					</>

					<Routes>
						<Route path="/" element={<Navigate to="/swap" />} />
						<Route path="swap" element={<></>} />
						<Route path="trade" element={<Trade />} />
						<Route path="settings" element={<Settings />} />
					</Routes>
				</TokensContext.Provider>
			</ExchangeContext.Provider>
		</EthersContext.Provider>
	);
};

export default App;
