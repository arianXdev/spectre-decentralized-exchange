import { ethers } from "hardhat";

const main = async () => {
	console.log("Preparing deployment...\n");

	// Fetch the contracts
	const Spectre = await ethers.getContractFactory("Spectre");
	const SpectreToken = await ethers.getContractFactory("SpectreToken");
	const Token = await ethers.getContractFactory("Token");

	// Get Accounts
	const [deployer, feeAccount] = await ethers.getSigners();
	console.log(`Accounts fetched: ${deployer.address}\n${feeAccount.address}\n`);

	// Deploy tokens
	const spectreToken = await SpectreToken.deploy();
	await spectreToken.deployed();

	const mUSDT = await Token.deploy("Mock Tether", "mUSDT", "1000000");
	await mUSDT.deployed();

	const mETH = await Token.deploy("Mock Ether", "mETH", "1000000");
	await mETH.deployed();

	const mDAI = await Token.deploy("Mock DAI", "mDAI", "1000000");
	await mDAI.deployed();

	console.log(`Spectre Token deployed to: ${spectreToken.address}`);
	console.log(`Mock Tether (mUSDT) deployed to: ${mUSDT.address}`);
	console.log(`Mock Ether (mETH) deployed to: ${mETH.address}`);
	console.log(`Mock DAI (mDAI) deployed to: ${mDAI.address}`);

	// Deploy the exchange
	const spectre = await Spectre.deploy(feeAccount.address, 1);
	await spectre.deployed();

	console.log(`The Spectre Exchange deployed to: ${spectre.address}`);
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
