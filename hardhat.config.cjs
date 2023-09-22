require("@nomicfoundation/hardhat-toolbox");
require("hardhat-jest");
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_POLYGON_API_KEY = process.env.ALCHEMY_POLYGON_API_KEY || "";

// Blockchain Explorer API Keys
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
// const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || "";
// const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const PRIVATE_KEYS = process.env.PRIVATE_KEYS || "";

module.exports = {
	solidity: "0.8.21",
	networks: {
		localhost: {},
		// Ethereum testnets
		sepolia: {
			url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
			accounts: PRIVATE_KEYS.split(","),
		},
		goerli: {
			url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
			accounts: PRIVATE_KEYS.split(","),
		},
		// Polygon testnet
		polygon: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`,
			accounts: PRIVATE_KEYS.split(","),
		},
		// BNB Smart Chain (formerly Binance Smart Chain) testnet
		bsc: {
			url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
			chainId: 97,
			gasPrice: 20000000000,
			accounts: PRIVATE_KEYS.split(","),
		},
		// Avalanche C-chain testnet (Fuji)
		avalanche: {
			url: `https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}`,
			accounts: PRIVATE_KEYS.split(","),
		},
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
		// apiKey: BSCSCAN_API_KEY,
		// apiKey: POLYGONSCAN_API_KEY,
	},
};
