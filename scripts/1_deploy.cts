import { ethers } from "hardhat";

const main = async () => {
	console.log("Preparing deployment...\n");

	// Fetch the contracts
	const Spectre = await ethers.getContractFactory("Spectre");
	const SpectreToken = await ethers.getContractFactory("SpectreToken");
	const Token = await ethers.getContractFactory("Token");

	// Get Accounts
	const [deployer, feeAccount] = await ethers.getSigners();
	console.log(`Accounts fetched: ${await deployer.getAddress()}\n${await feeAccount.getAddress()}\n`);

	// Deploy tokens
	const spectreToken = await SpectreToken.deploy();
	await spectreToken.waitForDeployment();

	const mUSDT = await Token.deploy("Mock Tether", "mUSDT", "1000000");
	await mUSDT.waitForDeployment();

	const mETH = await Token.deploy("Mock Ether", "mETH", "1000000");
	await mETH.waitForDeployment();

	const mDAI = await Token.deploy("Mock DAI", "mDAI", "1000000");
	await mDAI.waitForDeployment();

	console.log(`Spectre Token deployed to: ${await spectreToken.getAddress()}`);
	console.log(`Mock Tether (mUSDT) deployed to: ${await mUSDT.getAddress()}`);
	console.log(`Mock Ether (mETH) deployed to: ${await mETH.getAddress()}`);
	console.log(`Mock DAI (mDAI) deployed to: ${await mDAI.getAddress()}`);

	// Deploy the exchange
	const spectre = await Spectre.deploy(await feeAccount.getAddress(), 1);
	await spectre.waitForDeployment();

	console.log(`The Spectre Exchange deployed to: ${await spectre.getAddress()}`);
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
