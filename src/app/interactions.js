import { ethers } from "ethers";

import EXCHANGE_ABI from "../abis/Spectre.json";
import SPECTRE_TOKEN_ABI from "../abis/SpectreToken.json";
import TOKEN_ABI from "../abis/Token.json";

export const loadTokens = async (provider, addresses) => {
	const SPEC = new ethers.Contract(addresses.spectreToken.address, SPECTRE_TOKEN_ABI, provider);
	const mETH = new ethers.Contract(addresses.mETH.address, TOKEN_ABI, provider); // accessing to this smart contract
	const mDAI = new ethers.Contract(addresses.mDAI.address, TOKEN_ABI, provider);
	const mUSDT = new ethers.Contract(addresses.mUSDT.address, TOKEN_ABI, provider);

	return { SPEC, mETH, mDAI, mUSDT };
};

export const loadExchange = async (provider, address) => {
	const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
	return exchange;
};
