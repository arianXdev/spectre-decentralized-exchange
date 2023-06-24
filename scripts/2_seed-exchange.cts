import { ethers } from "hardhat";
import * as config from "../src/config.json";

const convertTokens = (n: number) => {
	return ethers.parseUnits(n.toString(), "ether");
};

const wait = (seconds) => {
	const milliseconds = seconds * 1000;
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const main = async () => {
	const accounts = await ethers.getSigners();

	const { chainId } = await ethers.provider.getNetwork();
	console.log(`Using ChainId ${chainId.toString()}`);

	// Fetch the deployed tokens
	const spectreToken = await ethers.getContractAt("SpectreToken", config[chainId.toString()].spectreToken.address);
	console.log(`Spectre Token fetched: ${await spectreToken.getAddress()}\n`);

	const mUSDT = await ethers.getContractAt("Token", config[chainId.toString()].mUSDT.address);
	console.log(`Mock Tether (mUSDT) fetched: ${await mUSDT.getAddress()}\n`);

	const mETH = await ethers.getContractAt("Token", config[chainId.toString()].mETH.address);
	console.log(`Mock Ether (mETH) fetched: ${await mETH.getAddress()}\n`);

	const mDAI = await ethers.getContractAt("Token", config[chainId.toString()].mDAI.address);
	console.log(`Mock DAI (mDAI) fetched: ${await mDAI.getAddress()}\n`);

	// Fetch the deployed exchange
	const spectre = await ethers.getContractAt("Spectre", config[chainId.toString()].spectre.address);
	console.log(`Spectre Exchange fetched: ${await spectre.getAddress()}\n`);

	// Set up users
	const deployer = accounts[0];
	const receiver = accounts[1];

	// Give tokens to account[1]
	const amount = convertTokens(10000);
	let transaction, result;

	// deployer transfers 10,000 mETH
	await mETH.connect(deployer).transfer(await receiver.getAddress(), amount);
	console.log(`Transferred ${amount} mETH tokens from ${await deployer.getAddress()} to ${await receiver.getAddress()}\n`);

	// Set up the exchange users
	const user1 = accounts[2];
	const user2 = accounts[3];

	// Give user1 20,000 SPEC
	await spectreToken.connect(deployer).transfer(await user1.getAddress(), convertTokens(20000));
	console.log(`Transferred ${convertTokens(20000)} SPEC tokens from ${await deployer.getAddress()} to ${await user1.getAddress()}\n`);

	// Give user1 10,000 mETH
	await mETH.connect(deployer).transfer(await user1.getAddress(), amount);
	console.log(`Transferred ${amount} mETH tokens from ${await deployer.getAddress()} to ${await user1.getAddress()}\n`);

	// Give user2 10,000 mDAI
	await mDAI.connect(deployer).transfer(await user2.getAddress(), amount);
	console.log(`Transferred ${amount} mDAI tokens from ${await deployer.getAddress()} to ${await user2.getAddress()}\n`);

	// user1 approves 10,000 SPEC deposit
	transaction = await spectreToken.connect(user1).approve(spectre.getAddress(), amount);
	result = await transaction.wait();
	console.log(`Approved ${amount} SPEC tokens from ${await user1.getAddress()}`);

	// user1 approves 10,000 mETH deposit
	transaction = await mETH.connect(user1).approve(spectre.getAddress(), amount);
	result = await transaction.wait();
	console.log(`Approved ${amount} mETH tokens from ${await user1.getAddress()}`);

	// user1 deposits 10,000 SPEC
	transaction = await spectre.connect(user1).deposit(await spectreToken.getAddress(), amount);
	result = await transaction.wait();
	console.log(`Deposited ${amount} SPEC from ${await user1.getAddress()}\n`);

	// user1 deposits 10,000 mETH
	transaction = await spectre.connect(user1).deposit(mETH.getAddress(), amount);
	result = await transaction.wait();
	console.log(`Deposited ${amount} mETH from ${await user1.getAddress()}\n`);

	// user2 approves 10,000 mDAI deposit
	transaction = await mDAI.connect(user2).approve(spectre.getAddress(), amount);
	result = await transaction.wait();
	console.log(`Approved ${amount} mDAI tokens from ${await user2.getAddress()}`);

	// user2 deposits 10,000 mDAI
	transaction = await spectre.connect(user2).deposit(await mDAI.getAddress(), amount);
	result = await transaction.wait();
	console.log(`Deposited ${amount} mDAI from ${await user2.getAddress()}\n`);

	// ------------------------------------------------------
	// ------- ****** ------- ORDERS -------- ****** --------
	// ------------------------------------------------------
	let orderId = 0;

	// ------------------- A CANECL ORDER -------------------
	// user1 makes an order to get mDAI tokens | user1 wants to pay 5 SPEC for 100 mDAI | user1 wants to have 100 mDAI
	transaction = await spectre
		.connect(user1)
		.makeOrder(await mDAI.getAddress(), convertTokens(100), await spectreToken.getAddress(), convertTokens(5));
	result = await transaction.wait();
	orderId++;
	console.log(`Made an order from ${await user1.getAddress()}`);

	// user1 cancels the order
	// orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	transaction = await spectre.connect(user1).cancelOrder(orderId);
	result = await transaction.wait();

	console.log(`Cancelled the order from ${await user1.getAddress()}\n`);

	// wait for 1 second
	await wait(1);

	// ------------------- FILLED ORDERS -------------------
	// user1 makes an order to get mDAI tokens | user1 wants to pay 10 SPEC for 100 mDAI | user1 wants to have 100 mDAI
	transaction = await spectre
		.connect(user1)
		.makeOrder(await mDAI.getAddress(), convertTokens(100), await spectreToken.getAddress(), convertTokens(10));
	result = await transaction.wait();
	// orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	orderId++;

	console.log(`Made an order from ${await user1.getAddress()} | Order ID: ${orderId}`);

	// user2 fills the order (created by user1)
	transaction = await spectre.connect(user2).fillOrder(orderId);
	result = await transaction.wait();
	console.log(`Filled the order by ${await user2.getAddress()} | Filled Order ID: ${orderId}`);

	// wait for 1 second
	await wait(1);

	// user1 makes an order to get mDAI tokens | user1 wants to pay 25 SPEC for 50 mDAI | user1 wants to have 50 mDAI
	transaction = await spectre
		.connect(user1)
		.makeOrder(await mDAI.getAddress(), convertTokens(50), await spectreToken.getAddress(), convertTokens(25));
	result = await transaction.wait();
	// orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	orderId++;

	console.log(`Made an order from ${await user1.getAddress()} | Order ID: ${orderId}`);

	// user2 fills the order (created by user1)
	transaction = await spectre.connect(user2).fillOrder(orderId);
	result = await transaction.wait();
	console.log(`Filled the order by ${await user2.getAddress()} | Filled Order ID: ${orderId}`);

	// wait for 1 second
	await wait(1);

	// user1 makes an order to get mDAI tokens | user1 wants to pay 80 SPEC for 700 mDAI | user1 wants to have 700 mDAI
	transaction = await spectre
		.connect(user1)
		.makeOrder(await mDAI.getAddress(), convertTokens(700), await spectreToken.getAddress(), convertTokens(80));
	result = await transaction.wait();
	// orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	orderId++;

	console.log(`Made an order from ${await user1.getAddress()} | Order ID: ${orderId}`);

	// user2 fills the order (created by user1)
	transaction = await spectre.connect(user2).fillOrder(orderId);
	result = await transaction.wait();
	console.log(`Filled the order by ${await user2.getAddress()} | Filled Order ID: ${orderId}`);

	// wait for 1 second
	await wait(1);

	// ------------------- OPEN ORDERS -------------------

	// user1 makes 12 orders
	for (let i = 1; i <= 12; i++) {
		transaction = await spectre
			.connect(user1)
			.makeOrder(await mDAI.getAddress(), convertTokens(i * 10 + 10), await spectreToken.getAddress(), convertTokens(10));
		result = await transaction.wait();
		orderId++;
		console.log(`Made an order from ${await user1.getAddress()}`);

		// wait for 1 second
		await wait(1);
	}

	// user2 makes 12 orders
	for (let i = 1; i <= 12; i++) {
		transaction = await spectre
			.connect(user2)
			.makeOrder(await spectreToken.getAddress(), convertTokens(10), await mDAI.getAddress(), convertTokens(i * 10 + 10));
		result = await transaction.wait();
		orderId++;
		console.log(`Made an order from ${await user2.getAddress()}`);

		// wait for 1 second
		await wait(1);
	}
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
