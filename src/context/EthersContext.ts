import { ethers } from "ethers";
import { createContext } from "react";

export const EthersContext = createContext({
	provider: {},
} as ethers.BrowserProvider | any);
