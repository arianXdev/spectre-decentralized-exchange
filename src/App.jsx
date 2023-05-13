import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { connectionLoaded } from "./features/connection/connectionSlice";

import { ethers } from "ethers";

import TOKEN_ABI from "./abis/Token.json";
import SPECTRE_TOKEN_API from "./abis/SpectreToken.json";
import config from "./config.json";

import { EthersContext } from "./context/EthersContext";
import { TokensContext } from "./context/TokensContext";

import "./App.css";

const App = () => {
	const dispatch = useDispatch();

	const [provider, setProvider] = useState({});
	const [tokens, setTokens] = useState({});

	const loadBlockchainData = async () => {
		// Get all the accounts from Metamask
		const account = await window.ethereum.request({ method: "eth_requestAccounts" }); // makes an RPC call to our node to get our accounts

		// Connect Ethers.js to the blockchain
		// RECAP: Ethers.js is a library that lets us talk to the blockchain, in order to connect to that, we have to create a new provider
		// You can think about this "provider" as our connection to the blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(provider);

		const { chainId } = await provider.getNetwork();

		// Save current connection information into the Redux store
		dispatch(connectionLoaded(chainId, account[0]));

		// Talking to our smart contracts
		const SPEC = new ethers.Contract(config[chainId].spectreToken.address, SPECTRE_TOKEN_API, provider); // accessing to this smart contract
		const mETH = new ethers.Contract(config[chainId].mETH.address, TOKEN_ABI, provider); // accessing to this smart contract
		const mDAI = new ethers.Contract(config[chainId].mDAI.address, TOKEN_ABI, provider);
		const mUSDT = new ethers.Contract(config[chainId].mTether.address, TOKEN_ABI, provider);

		setTokens({
			SPEC: { symbol: "SPEC", contract: SPEC },
			mETH: { symbol: "mETH", contract: mETH },
			mDAI: { symbol: "mDAI", contract: mDAI },
			mTether: { symbol: "mUSDT", contract: mUSDT },
		});
	};

	useEffect(() => {
		loadBlockchainData();
	}, []);

	return (
		<EthersContext.Provider value={{ provider }}>
			<TokensContext.Provider value={{ tokens }}>
				<main>
					<h1>Hello, World!</h1>
				</main>
			</TokensContext.Provider>
		</EthersContext.Provider>
	);
};

export default App;
