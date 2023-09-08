import { ethers } from "ethers";

import SPECTRE_TOKEN_ABI from "../abis/SpectreToken.json";
import TOKEN_ABI from "../abis/Token.json";

import config from "../config.json";

import { tokensLoaded } from "../state/tokens/tokensSlice";
import cryptosLogo from "../helpers/cryptosLogo";

import { AppDispatch } from "../state";

export const loadTokens = async (provider: ethers.BrowserProvider, addresses: string[], dispatch: AppDispatch) => {
	const { chainId } = await provider.getNetwork();

	const currentNetwork = config[chainId.toString()];

	const SPEC = new ethers.Contract(currentNetwork.spectreToken.address, SPECTRE_TOKEN_ABI, provider);
	const mETH = new ethers.Contract(currentNetwork.mETH.address, TOKEN_ABI, provider); // accessing to this smart contract
	const mDAI = new ethers.Contract(currentNetwork.mDAI.address, TOKEN_ABI, provider);
	const mUSDT = new ethers.Contract(currentNetwork.mUSDT.address, TOKEN_ABI, provider);

	const firstToken = new ethers.Contract(addresses[0], SPECTRE_TOKEN_ABI, provider); // SPEC token

	const token1 = {
		name: await firstToken.name(),
		address: await firstToken.getAddress(),
		symbol: await firstToken.symbol(),
		decimals: (await firstToken.decimals()).toString(),
		imageURL: cryptosLogo[await firstToken.symbol()],
	};

	const secondToken = new ethers.Contract(addresses[1], TOKEN_ABI, provider); // any other tokens

	const token2 = {
		name: await secondToken.name(),
		address: await secondToken.getAddress(),
		symbol: await secondToken.symbol(),
		decimals: (await secondToken.decimals()).toString(),
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
