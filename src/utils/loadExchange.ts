import { ethers } from "ethers";

import EXCHANGE_ABI from "../abis/Spectre.json";

export const loadExchange = async (provider: any, address: string) => {
	const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
	return exchange;
};
