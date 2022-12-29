const { ethers } = require("hardhat");

const main = async () => {
	// fetch the contract
	const SpectreToken = await ethers.getContractFactory("SpectreToken");

	// deploy the contract
	const spectreToken = await SpectreToken.deploy();
	await spectreToken.deployed();

	console.log(`Spectre Token deployed to: ${spectreToken.address}`);
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
