require("@nomicfoundation/hardhat-toolbox");
require("hardhat-jest");
require("dotenv").config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_POLYGON_API_KEY = process.env.ALCHEMY_POLYGON_API_KEY || "";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const PRIVATE_KEYS = process.env.PRIVATE_KEYS || "";

module.exports = {
	solidity: "0.8.21",
	networks: {
		localhost: {},
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
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
};
