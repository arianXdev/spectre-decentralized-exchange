// require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("hardhat-jest");
require("dotenv").config();

module.exports = {
	solidity: "0.8.18",
	networks: {
		localhost: {},
	},
};
