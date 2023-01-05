const { ethers } = require("hardhat");

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Spectre Token", () => {
	let spectreToken, accounts, deployer;

	// beforeEach method will run before tests
	beforeEach(async () => {
		// Fetch the contract using ethers.js
		const SpectreToken = await ethers.getContractFactory("SpectreToken");
		spectreToken = await SpectreToken.deploy();

		// Get all the accounts
		accounts = await ethers.getSigners();
		// Get the deployer / owner account
		deployer = accounts[0];
		// Get the receiver account
		receiver = accounts[1];
	});

	describe("Contract Deployment", () => {
		test("Token Name should be Spectre", async () => {
			const name = await spectreToken.name();
			expect(name).toBe("Spectre");
		});

		test("Token Symbol should be SPEC", async () => {
			const symbol = await spectreToken.symbol();
			expect(symbol).toBe("SPEC");
		});

		test("Token decimals should be 18", async () => {
			expect(await spectreToken.decimals()).toStrictEqual(18);
		});

		test("Total number of tokens in circulation should be 1 million SPEC", async () => {
			expect(Number(await spectreToken.totalSupply())).toStrictEqual(Number(tokens(1000000)));
		});

		test("Assign all totalSupply to deployer / owner", async () => {
			expect(await spectreToken.balanceOf(deployer.address)).toStrictEqual(tokens(1000000));
		});
	});

	describe("Transfering tokens", () => {
		let amount, transaction, result;

		beforeEach(async () => {
			amount = tokens(100); // 100 SPEC tokens

			// Transfer 100 SPEC
			transaction = await spectreToken.connect(deployer).transfer(receiver.address, amount);
			result = await transaction.wait();
		});

		test("Transfer tokens should be done", async () => {
			expect(await spectreToken.balanceOf(deployer.address)).toEqual(tokens(999900));
			expect(await spectreToken.balanceOf(receiver.address)).toEqual(amount);
		});

		test("Emits a Transfer event", async () => {
			const transferEvent = await result.events[0];
			const args = transferEvent.args;

			expect(transferEvent.event).toBe("Transfer");

			expect(args.from).toEqual(deployer.address);
			expect(args.to).toEqual(receiver.address);
		});
	});
});
