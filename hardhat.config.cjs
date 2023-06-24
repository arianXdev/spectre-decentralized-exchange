require("@nomicfoundation/hardhat-toolbox");
require("hardhat-jest");
require("dotenv").config();

module.exports = {
	solidity: "0.8.20",
	networks: {
		localhost: {},
	},
};
