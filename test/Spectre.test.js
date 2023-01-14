const { ethers } = require("hardhat");

const convertTokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Spectre Exchange", () => {
	let spectre, tether, spectreToken, accounts, deployer, feeAccount, user1, user2;

	const feePercent = 10; // %10

	beforeEach(async () => {
		const SpectreExchange = await ethers.getContractFactory("Spectre");
		const SpectreToken = await ethers.getContractFactory("SpectreToken");
		const Token = await ethers.getContractFactory("Token");

		// Get all the accounts
		accounts = await ethers.getSigners();
		deployer = await accounts[0];
		feeAccount = await accounts[1];

		// Users / Customers
		user1 = await accounts[2];
		user2 = await accounts[3];

		// Deploy mock Tether token
		tether = await Token.deploy("Tether", "USDT", 1000000);
		// Deploy Spectre Token
		spectreToken = await SpectreToken.deploy();
		// Deploy the exchange contract
		spectre = await SpectreExchange.deploy(feeAccount.address, feePercent);

		// Charge / Give user1 and user2, 100 USDT in order to work with the exchange
		await tether.connect(deployer).transfer(user1.address, convertTokens(100));
		await tether.connect(deployer).transfer(user2.address, convertTokens(100));

		// Charge / Give user1 and user2, 100 SPEC in order to interact with the exchange
		await spectreToken.connect(deployer).transfer(user1.address, convertTokens(100));
		await spectreToken.connect(deployer).transfer(user2.address, convertTokens(100));
	});

	describe("Deployment", () => {
		test("tracks the fee account", async () => {
			expect(await spectre.feeAccount()).toBe(feeAccount.address);
		});

		test("tracks the fee percent", async () => {
			expect(Number(await spectre.feePercent())).toEqual(feePercent);
		});
	});

	describe("Depositing Tokens", () => {
		let transaction, result;
		let amount = convertTokens(10);

		beforeEach(async () => {
			// Approve transfering tokens (First step)
			await spectreToken.connect(user1).approve(spectre.address, amount);
			await tether.connect(user1).approve(spectre.address, amount);

			// Deposit tokens (Second step)
			transaction = await spectre.connect(user1).deposit(spectreToken.address, amount);
			transaction = await spectre.connect(user1).deposit(tether.address, amount);

			result = await transaction.wait();
		});

		test("tracks the SpectreToken (SPEC) deposit", async () => {
			expect(await spectreToken.balanceOf(spectre.address)).toEqual(amount);
			expect(await spectre.balanceOf(spectreToken.address, user1.address)).toEqual(amount);
		});

		test("tracks the Tether (USDT) deposit", async () => {
			expect(await tether.balanceOf(spectre.address)).toEqual(amount);
			expect(await spectre.balanceOf(tether.address, user1.address)).toEqual(amount);
		});
	});
});
