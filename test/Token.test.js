const { ethers } = require("hardhat");

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token Contract Deployment", () => {
	let token, accounts, deployer;

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
		deployer = accounts[0].address;
	});

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
		expect(await token.balanceOf(deployer)).toStrictEqual(tokens(totalSupply));
	});
});
