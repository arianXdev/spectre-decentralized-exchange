require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-jest");
require("dotenv").config();

module.exports = {
	solidity: "0.8.17",
	networks: {
		localhost: {},
	},
};
