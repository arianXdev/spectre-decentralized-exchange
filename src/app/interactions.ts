import { ethers } from "ethers";

import EXCHANGE_ABI from "../abis/Spectre.json";
import SPECTRE_TOKEN_ABI from "../abis/SpectreToken.json";
import TOKEN_ABI from "../abis/Token.json";

import config from "../config.json";

import { connected } from "../features/connection/connectionSlice";
import { tokensLoaded } from "../features/tokens/tokensSlice";

import useMetaMask from "../hooks/useMetaMask";
import { AppDispatch } from "./store";

export const loadConnection = async (provider: any, dispatch: AppDispatch) => {
	// Get all the accounts from Metamask Injected Provider API
	const accounts = await useMetaMask().request({ method: "eth_requestAccounts" }); // makes an RPC call to our node to get our accounts
	const account = ethers.utils.getAddress(accounts[0]);

	// Get the ETH balance of the current account from Metamask
	let balance = await provider.getBalance(account);
	balance = ethers.utils.formatEther(balance);

	// Fetch current network's chainId (e.g. Hardhat: 31337)
	const { chainId } = await provider.getNetwork();

	// Save the current connection information into the Redux store
	dispatch(connected(chainId, account, balance));

	return { chainId, balance, accounts };
};

export const loadTokens = async (provider: any, addresses: any, dispatch: AppDispatch) => {
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

export const loadExchange = async (provider: any, address: string) => {
	const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
	return exchange;
};
