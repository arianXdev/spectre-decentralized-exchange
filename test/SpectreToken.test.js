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
