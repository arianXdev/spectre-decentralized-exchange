import { useEffect } from "react";

import { ethers } from "ethers";

import TOKEN_ABI from "./abis/Token.json";
import config from "./config.json";
import "./App.css";

const App = () => {
	const loadBlockchainData = async () => {
		// Get all the accounts from Metamask
		const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }); // makes an RPC call to our node to get our accounts

		// Connect Ethers.js to the blockchain
		// RECAP: Ethers.js is a library that lets us talk to the blockchain, in order to connect to that, we have to create a new provider
		// You can think about this "provider" as our connection to the blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const { chainId } = await provider.getNetwork();

		// Talking to our smart contracts
		const mETH = new ethers.Contract(config[chainId].mETH.address, TOKEN_ABI, provider); // accessing to this smart contract
		const mDAI = new ethers.Contract(config[chainId].mDAI.address, TOKEN_ABI, provider);
		const mTether = new ethers.Contract(config[chainId].mTether.address, TOKEN_ABI, provider);
	};

	useEffect(() => {
		loadBlockchainData();
	}, []);

	return <div>Hello World!</div>;
};

export default App;
