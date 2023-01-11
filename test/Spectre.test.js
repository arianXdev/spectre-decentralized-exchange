const { ethers } = require("hardhat");

describe("Spectre Exchange", () => {
	let spectre, accounts;

	beforeEach(async () => {
		// Deploy the exchange contract
		const SpectreExchange = await ethers.getContractFactory("Spectre");
		spectre = await SpectreExchange.deploy();

		// Get all the accounts
		accounts = await ethers.getSigners();
	});
});
