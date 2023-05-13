import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { connectionLoaded } from "./features/connection/connectionSlice";

import { ethers } from "ethers";

import TOKEN_ABI from "./abis/Token.json";
import config from "./config.json";

import { EthersContext } from "./context/EthersContext";
import "./App.css";

const App = () => {
	const dispatch = useDispatch();
	const [provider, setProvider] = useState();

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
		const mETH = new ethers.Contract(config[chainId].mETH.address, TOKEN_ABI, provider); // accessing to this smart contract
		const mDAI = new ethers.Contract(config[chainId].mDAI.address, TOKEN_ABI, provider);
		const mTether = new ethers.Contract(config[chainId].mTether.address, TOKEN_ABI, provider);
	};

	useEffect(() => {
		loadBlockchainData();
	}, []);

	return (
		<EthersContext.Provider value={{ provider }}>
			<main>
				<h1>Hello, World!</h1>
			</main>
		</EthersContext.Provider>
	);
};

export default App;
