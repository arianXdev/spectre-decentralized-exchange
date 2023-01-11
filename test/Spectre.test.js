const { ethers } = require("hardhat");

describe("Spectre Exchange", () => {
	let spectre, accounts, deployer, feeAccount;

	beforeEach(async () => {
		// Get all the accounts
		accounts = await ethers.getSigners();
		deployer = await accounts[0];
		feeAccount = await accounts[1];

		// Deploy the exchange contract
		const SpectreExchange = await ethers.getContractFactory("Spectre");
		spectre = await SpectreExchange.deploy(feeAccount.address);
	});

	describe("Deployment", () => {
		test("tracks the fee account", async () => {
			expect(await spectre.feeAccount()).toBe(feeAccount.address);
		});
	});
});
