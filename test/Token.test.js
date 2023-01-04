const { ethers } = require("hardhat");

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
	let token, accounts, deployer, receiver;

	const name = "Arian";
	const symbol = "ARN";
	const decimals = 18;
	const totalSupply = 1000000;

	// beforeEach method will run before tests
	beforeEach(async () => {
		// Fetch the contract using ethers.js
		const Token = await ethers.getContractFactory("Token");
		token = await Token.deploy(name, symbol, totalSupply);

		// Get all the ethereum accounts
		accounts = await ethers.getSigners();
		// Get the deployer / owner account
		deployer = accounts[0];
		// Get the receiver / customer account
		receiver = accounts[1];
	});

	describe("Contract Deployment", () => {
		test("Token Name should be correct", async () => {
			expect(await token.name()).toBe(name);
		});

		test("Token Symbol should be correct", async () => {
			expect(await token.symbol()).toBe(symbol);
		});

		test("Token decimals should be 18", async () => {
			expect(await token.decimals()).toStrictEqual(decimals);
		});

		test("Total number of tokens in circulation should be correct", async () => {
			expect(Number(await token.totalSupply())).toStrictEqual(Number(tokens(totalSupply)));
		});

		test("Assign totalSupply to deployer (owner)", async () => {
			expect(await token.balanceOf(deployer.address)).toStrictEqual(tokens(totalSupply));
		});
	});

	describe("Transfering Tokens", () => {
		let amount, transaction, result;

		beforeEach(async () => {
			amount = tokens(100); // 100 ARN

			// Transfer tokens
			transaction = await token.connect(deployer).transfer(receiver.address, amount); // connects deployer to the Token smart contract, so it can sign the trxs
			result = await transaction.wait(); // wait for trx to get included and add into the Blockchain
		});

		test("Transfer tokens should be done", async () => {
			// Log the balance before transfer
			// console.log("Deployer balance before transfer ", ethers.utils.formatEther(await token.balanceOf(deployer.address)), " ARN");
			// console.log("Receiver balance before transfer ", ethers.utils.formatEther(await token.balanceOf(receiver.address)), " ARN");

			expect(await token.balanceOf(deployer.address)).toEqual(tokens(999900));
			expect(await token.balanceOf(receiver.address)).toEqual(amount);
		});
	});
});
