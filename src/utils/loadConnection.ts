import { ethers } from "ethers";

import { AppDispatch } from "../state";
import { connected } from "../state/connection/connectionSlice";

import useMetaMask from "../hooks/useMetaMask";

export const loadConnection = async (provider: ethers.BrowserProvider, dispatch: AppDispatch) => {
	// Get all the accounts from Metamask Injected Provider API
	const accounts = await useMetaMask().request({ method: "eth_requestAccounts" }); // makes an RPC call to our node to get our accounts
	const account = ethers.getAddress(accounts[0]);

	// Get the ETH balance of the current account from Metamask
	let balance: string | bigint = await provider.getBalance(account);
	balance = ethers.formatEther(balance);

	// Fetch current network's chainId (e.g. Hardhat: 31337)
	const { chainId } = await provider.getNetwork();

	// Save the current connection information into the Redux store
	dispatch(connected(Number(chainId), account, balance));

	return { chainId, balance, accounts };
};
