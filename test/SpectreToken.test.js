const { ethers } = require("hardhat");

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Spectre Token Deployment", () => {
	let spectreToken;

	// beforeEach method will run before tests
	beforeEach(async () => {
		// Fetch the contract using ethers.js
		const SpectreToken = await ethers.getContractFactory("SpectreToken");
		spectreToken = await SpectreToken.deploy();
	});

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
});
