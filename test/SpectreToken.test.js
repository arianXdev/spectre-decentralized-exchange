const { ethers } = require("hardhat");

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
	const value = Number(ethers.utils.parseUnits("1000000", "ether")); // convert 1 million ether to wei
	expect(Number(await spectreToken.totalSupply())).toStrictEqual(value);
});
