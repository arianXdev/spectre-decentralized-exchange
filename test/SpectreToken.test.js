const { ethers } = require("hardhat");

test("Token Name should be Spectre", async () => {
	// Fetch the contract using ethers.js
	const SpectreToken = await ethers.getContractFactory("SpectreToken");
	const spectreToken = await SpectreToken.deploy();

	const name = await spectreToken.name();

	expect(name).toBe("Spectre");
});
