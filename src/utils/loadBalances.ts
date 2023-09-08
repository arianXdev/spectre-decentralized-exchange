import { ethers } from "ethers";

import { balancesLoaded } from "../state/tokens/tokensSlice";
import { exchangeBalancesLoaded } from "../state/exchange/exchangeSlice";

import { AppDispatch } from "../state";

// Load User Balances (including Wallet balance & Exchange balance)
export const loadBalances = async (
	exchange: ethers.ContractInterface,
	tokens: Array<ethers.Contract>,
	account: string,
	dispatch: AppDispatch
) => {
	let token1WalletBalance = ethers.formatUnits(await tokens[0].balanceOf(account), "ether"); // format it to ether
	let token2WalletBalance = ethers.formatUnits(await tokens[1].balanceOf(account), "ether");
	dispatch(balancesLoaded({ token1Balance: token1WalletBalance, token2Balance: token2WalletBalance }));

	const token1ExchangeBalance = ethers.formatUnits(await exchange.balanceOf(await tokens[0].getAddress(), account), "ether");
	const token2ExchangeBalance = ethers.formatUnits(await exchange.balanceOf(await tokens[1].getAddress(), account), "ether");
	dispatch(exchangeBalancesLoaded(token1ExchangeBalance, token2ExchangeBalance));
};
