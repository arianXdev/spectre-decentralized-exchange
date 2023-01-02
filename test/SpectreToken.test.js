const { ethers } = require("hardhat");

test("Token Name should be Spectre", async () => {
	// Fetch the contract using ethers.js
	const SpectreToken = await ethers.getContractFactory("SpectreToken");
	const spectreToken = await SpectreToken.deploy();

	const name = await spectreToken.name();

	expect(name).toBe("Spectre");
});

test("Token Symbol should be SPEC", async () => {
	const SpectreToken = await ethers.getContractFactory("SpectreToken");
	const spectreToken = await SpectreToken.deploy();

	const symbol = await spectreToken.symbol();

	expect(symbol).toBe("SPEC");
});
