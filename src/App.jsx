import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { connectionLoaded } from "./features/connection/connectionSlice";
import { tokensLoaded } from "./features/tokens/tokensSlice";

import { ethers } from "ethers";

import config from "./config.json";

import { EthersContext } from "./context/EthersContext";
import { ExchangeContext } from "./context/ExchangeContext";
import { TokensContext } from "./context/TokensContext";

import { loadTokens, loadExchange } from "./app/interactions";

import "./App.css";

const App = () => {
	const dispatch = useDispatch();

	const [provider, setProvider] = useState({});
	const [exchange, setExchange] = useState({});
	const [tokens, setTokens] = useState({});

	const loadBlockchainData = async () => {
		// Get all the accounts from Metamask
		const account = await window.ethereum.request({ method: "eth_requestAccounts" }); // makes an RPC call to our node to get our accounts

		// Connect to the Blockchain using Ethers.js
		// the term "provider" in this case is our connection to the blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(provider);

		const { chainId } = await provider.getNetwork();

		// Save current connection information into the Redux store
		dispatch(connectionLoaded(chainId, account[0]));

		// Load all tokens contracts
		const { SPEC, mETH, mDAI, mUSDT } = await loadTokens(provider, [config[chainId]][0]);

		// Save the contracts of all tokens in state & make it globally accessible across the entire app using context
		setTokens({
			SPEC: { symbol: "SPEC", contract: SPEC },
			mETH: { symbol: "mETH", contract: mETH },
			mDAI: { symbol: "mDAI", contract: mDAI },
			mTether: { symbol: "mUSDT", contract: mUSDT },
		});

		// Save the information of all tokens inside of the Redux store (except their contracts)
		dispatch(
			tokensLoaded({
				SPEC: config[chainId].spectreToken,
				mETH: config[chainId].mETH,
				mDAI: config[chainId].mDAI,
				mUSDT: config[chainId].mDAI,
			})
		);

		// Get the Spectre exchange contract
		const exchange = await loadExchange(provider, config[chainId].spectre.address);
		setExchange(exchange);
	};

	useEffect(() => {
		// When the exchange runs, it's gonna get all the Blockchain data and contracts
		loadBlockchainData();
	}, []);

	return (
		<EthersContext.Provider value={{ provider }}>
			<ExchangeContext.Provider value={{ exchange }}>
				<TokensContext.Provider value={{ tokens }}>
					<main>
						<h1>Hello, World!</h1>
					</main>
				</TokensContext.Provider>
			</ExchangeContext.Provider>
		</EthersContext.Provider>
	);
};

export default App;
