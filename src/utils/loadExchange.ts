import { ethers } from "ethers";

import EXCHANGE_ABI from "../abis/Spectre.json";

export const loadExchange = async (provider: ethers.BrowserProvider, address: string) => {
	const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
	return exchange;
};
