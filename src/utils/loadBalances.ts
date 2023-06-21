import { ethers } from "ethers";

import { balancesLoaded } from "../features/tokens/tokensSlice";
import { exchangeBalancesLoaded } from "../features/exchange/exchangeSlice";

import { AppDispatch } from "../app/store";

// Load User Balances (including Wallet balance & Exchange balance)
export const loadBalances = async (exchange: any, tokens: [], account: string, dispatch: AppDispatch) => {
	let token1WalletBalance = ethers.utils.formatUnits(await tokens[0].balanceOf(account), "ether"); // format it to ether
	let token2WalletBalance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), "ether");
	dispatch(balancesLoaded({ token1Balance: token1WalletBalance, token2Balance: token2WalletBalance }));

	const token1ExchangeBalance = ethers.utils.formatUnits(await exchange.balanceOf(tokens[0].address, account), "ether");
	const token2ExchangeBalance = ethers.utils.formatUnits(await exchange.balanceOf(tokens[1].address, account), "ether");
	dispatch(exchangeBalancesLoaded({ token1Balance: token1ExchangeBalance, token2Balance: token2ExchangeBalance }));
};
