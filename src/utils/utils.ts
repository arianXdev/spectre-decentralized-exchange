import { ethers } from "ethers";

import EXCHANGE_ABI from "../abis/Spectre.json";
import SPECTRE_TOKEN_ABI from "../abis/SpectreToken.json";
import TOKEN_ABI from "../abis/Token.json";

import { connected } from "../features/connection/connectionSlice";
import { tokensLoaded, balancesLoaded } from "../features/tokens/tokensSlice";
import { exchangeBalancesLoaded, transferRequested, transferSuccess, transferFailed } from "../features/exchange/exchangeSlice";

import config from "../config.json";

import useMetaMask from "../hooks/useMetaMask";
import { AppDispatch } from "../app/store";

import cryptosLogo from "../helpers/cryptosLogo";

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

export const loadTokens = async (provider: any, addresses: string[], dispatch: AppDispatch) => {
	const { chainId } = await provider.getNetwork();

	const SPEC = new ethers.Contract(config[chainId].spectreToken.address, SPECTRE_TOKEN_ABI, provider);
	const mETH = new ethers.Contract(config[chainId].mETH.address, TOKEN_ABI, provider); // accessing to this smart contract
	const mDAI = new ethers.Contract(config[chainId].mDAI.address, TOKEN_ABI, provider);
	const mUSDT = new ethers.Contract(config[chainId].mUSDT.address, TOKEN_ABI, provider);

	const firstToken = new ethers.Contract(addresses[0], SPECTRE_TOKEN_ABI, provider); // SPEC token

	const token1 = {
		name: await firstToken.name(),
		address: firstToken.address,
		symbol: await firstToken.symbol(),
		decimals: await firstToken.decimals(),
		imageURL: cryptosLogo[await firstToken.symbol()],
	};

	const secondToken = new ethers.Contract(addresses[1], TOKEN_ABI, provider); // any other tokens

	const token2 = {
		name: await secondToken.name(),
		address: secondToken.address,
		symbol: await secondToken.symbol(),
		decimals: await secondToken.decimals(),
		imageURL: cryptosLogo[await secondToken.symbol()],
	};

	// Save the information of all tokens inside of the Redux store (except their contracts)
	dispatch(
		tokensLoaded({
			token1,
			token2,
		})
	);

	return { SPEC, mETH, mDAI, mUSDT };
};

export const loadExchange = async (provider: any, address: string) => {
	const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
	return exchange;
};

// Load User Balances (including Wallet balance & Exchange balance)
export const loadBalances = async (exchange: any, tokens: [], account: string, dispatch: AppDispatch) => {
	let token1WalletBalance = ethers.utils.formatUnits(await tokens[0].balanceOf(account), "ether"); // format it to ether
	let token2WalletBalance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), "ether");
	dispatch(balancesLoaded({ token1Balance: token1WalletBalance, token2Balance: token2WalletBalance }));

	const token1ExchangeBalance = ethers.utils.formatUnits(await exchange.balanceOf(tokens[0].address, account), "ether");
	const token2ExchangeBalance = ethers.utils.formatUnits(await exchange.balanceOf(tokens[1].address, account), "ether");
	dispatch(exchangeBalancesLoaded({ token1Balance: token1ExchangeBalance, token2Balance: token2ExchangeBalance }));
};

// Transfer tokens (Deposits & Withdraws)
enum TransferType {
	WITHDRAW = "Withdraw",
	DEPOSIT = "Deposit",
}

export const subscribeToEvents = (exchange, dispatch) => {
	// When DEPOSIT happens, it's gonna notify the app
	exchange.on(TransferType.DEPOSIT, (token, user, amount, balance, event) => {
		// Notify app that transfer was successful
		dispatch(transferSuccess());
	});
};

export const transferTokens = async (provider, exchange, transferType: TransferType, token, amount: string, dispatch: AppDispatch) => {
	let transaction;

	dispatch(transferRequested());

	try {
		// Get the current user (i.e. in this case from MetaMask)
		const signer = await provider.getSigner();
		const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18);

		// Approve token transfering
		transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);
		await transaction.wait(); // wait to finish

		// Do the transfer (after the approval)
		transaction = await exchange.connect(signer).deposit(token.address, amountToTransfer);
		await transaction.wait();
	} catch (e) {
		dispatch(transferFailed());
		console.log(e);
	}

	// Recap: Events are a way for applications to subscribe to anything that's happened to the Blockchain and where / when it took place
};
