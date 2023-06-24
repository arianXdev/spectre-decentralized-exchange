import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "../app/hooks";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ethers } from "ethers";

import config from "../config.json";

import { EthersContext } from "../context/EthersContext";
import { ExchangeContext } from "../context/ExchangeContext";
import { TokensContext } from "../context/TokensContext";

import Header from "~/layouts/Header";
import InstallWallet from "./InstallWallet";
import Trade from "./Trade";

import { Overlay } from "../components";

import { loadConnection, loadTokens, loadExchange, subscribeToEvents } from "../utils";
import useMetaMask from "../hooks/useMetaMask";

import { isMobile } from "react-device-detect";
import { Toaster } from "react-hot-toast";
import Typed from "typed.js";

import "./App.scss";

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const { pathname: routeName } = useLocation();

	const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
	const [provider, setProvider] = useState({});
	const [exchange, setExchange] = useState({});
	const [tokens, setTokens] = useState<any>({});

	const arianNameRef = useRef(null);

	const loadBlockchainData = async () => {
		if (!isMobile) window.ethereum._state.accounts = [];

		// the term "provider" in this case is our connection to the blockchain
		// eslint-disable-next-line
		const provider = new ethers.BrowserProvider(window.ethereum);
		setProvider(provider);

		const { chainId } = await provider.getNetwork();

		// load connections & save the current connection information whenever the account has been changed
		useMetaMask().on("accountsChanged", async () => {
			await loadConnection(provider, dispatch);
		});

		// Reload the page when the user changed their network
		useMetaMask().on("chainChanged", () => window.location.reload());

		// Load all tokens contracts
		const { SPEC, mETH, mDAI, mUSDT } = await loadTokens(
			provider,
			[config[chainId.toString()].spectreToken.address, config[chainId.toString()].mETH.address],
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
		const exchange = await loadExchange(provider, config[chainId.toString()].spectre.address);
		setExchange(exchange);

		// Load the connection if the user has been connected already
		useMetaMask().selectedAddress ? await loadConnection(provider, dispatch) : null;

		// Listen to all events from the Blockchain
		subscribeToEvents(exchange, dispatch);
	};

	useEffect(() => {
		if (typeof window.ethereum === "undefined") {
			setIsMetaMaskInstalled(false);
		} else {
			// When the exchange runs, it's gonna get all the Blockchain data and contracts
			loadBlockchainData();
		}
	}, []);

	useEffect(() => {
		if (isMetaMaskInstalled && !isMobile && routeName === "/swap") {
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
	}, [routeName]);

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
					</Routes>
				</TokensContext.Provider>
			</ExchangeContext.Provider>
		</EthersContext.Provider>
	);
};

export default App;
