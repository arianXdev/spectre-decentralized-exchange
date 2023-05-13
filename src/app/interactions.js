import { ethers } from "ethers";

import EXCHANGE_ABI from "../abis/Spectre.json";
import SPECTRE_TOKEN_ABI from "../abis/SpectreToken.json";
import TOKEN_ABI from "../abis/Token.json";

import config from "../config.json";

import { connectionLoaded } from "../features/connection/connectionSlice";
import { tokensLoaded } from "../features/tokens/tokensSlice";

export const loadConnection = async (provider, dispatch) => {
	// Get all the accounts from Metamask
	const account = await window.ethereum.request({ method: "eth_requestAccounts" }); // makes an RPC call to our node to get our accounts

	// Connect to the Blockchain using Ethers.js
	const { chainId } = await provider.getNetwork();

	// Save the current connection information into the Redux store
	dispatch(connectionLoaded(chainId, account[0]));

	return { chainId };
};

export const loadTokens = async (provider, addresses, dispatch) => {
	const { chainId } = await provider.getNetwork();

	const SPEC = new ethers.Contract(addresses.spectreToken.address, SPECTRE_TOKEN_ABI, provider);
	const mETH = new ethers.Contract(addresses.mETH.address, TOKEN_ABI, provider); // accessing to this smart contract
	const mDAI = new ethers.Contract(addresses.mDAI.address, TOKEN_ABI, provider);
	const mUSDT = new ethers.Contract(addresses.mUSDT.address, TOKEN_ABI, provider);

	// Save the information of all tokens inside of the Redux store (except their contracts)
	dispatch(
		tokensLoaded({
			SPEC: config[chainId].spectreToken,
			mETH: config[chainId].mETH,
			mDAI: config[chainId].mDAI,
			mUSDT: config[chainId].mDAI,
		})
	);

	return { SPEC, mETH, mDAI, mUSDT };
};

export const loadExchange = async (provider, address) => {
	const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
	return exchange;
};
