const { ethers } = require("hardhat");
const config = require("../src/config.json");

const convertTokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), "ether");
};

const wait = (seconds) => {
	const milliseconds = seconds * 1000;
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const main = async () => {
	const accounts = await ethers.getSigners();

	const { chainId } = await ethers.provider.getNetwork();
	console.log(`Using ChainId: ${chainId}`);

	// Fetch the deployed tokens
	const spectreToken = await ethers.getContractAt("SpectreToken", config[chainId].spectreToken.address);
	console.log(`Spectre Token fetched: ${spectreToken.address}\n`);

	const mTether = await ethers.getContractAt("Token", config[chainId].mTether.address);
	console.log(`Mock Tether (mUSDT) fetched: ${mTether.address}\n`);

	const mETH = await ethers.getContractAt("Token", config[chainId].mETH.address);
	console.log(`Mock Ether (mETH) fetched: ${mETH.address}\n`);

	const mDAI = await ethers.getContractAt("Token", config[chainId].mDAI.address);
	console.log(`Mock DAI (mDAI) fetched: ${mDAI.address}\n`);

	// Fetch the deployed exchange
	const spectre = await ethers.getContractAt("Spectre", config[chainId].spectre.address);
	console.log(`Spectre Exchange fetched: ${spectre.address}\n`);

	// Set up users
	const deployer = accounts[0];
	const receiver = accounts[1];

	// Give tokens to account[1]
	let amount = convertTokens(10000);
	let transaction, result;

	// deployer transfers 10,000 mETH
	await mETH.connect(deployer).transfer(receiver.address, amount);
	console.log(`Transferred ${amount} mETH tokens from ${deployer.address} to ${receiver.address}\n`);

	// Set up the exchange users
	const user1 = accounts[2];
	const user2 = accounts[3];

	// Give user1 10,000 SPEC
	await spectreToken.connect(deployer).transfer(user1.address, amount);
	console.log(`Transferred ${amount} SPEC tokens from ${deployer.address} to ${user1.address}\n`);

	// Give user2 10,000 mDAI
	await mDAI.connect(deployer).transfer(user2.address, amount);
	console.log(`Transferred ${amount} mDAI tokens from ${deployer.address} to ${user2.address}\n`);

	// user1 approves 10,000 SPEC deposit
	transaction = await spectreToken.connect(user1).approve(spectre.address, amount);
	result = await transaction.wait();
	console.log(`Approved ${amount} SPEC tokens from ${user1.address}`);

	// user1 deposits 10,000 SPEC
	transaction = await spectre.connect(user1).deposit(spectreToken.address, amount);
	result = await transaction.wait();
	console.log(`Deposited ${amount} SPEC from ${user1.address}\n`);

	// user2 approves 10,000 mDAI deposit
	transaction = await mDAI.connect(user2).approve(spectre.address, amount);
	result = await transaction.wait();
	console.log(`Approved ${amount} mDAI tokens from ${user2.address}`);

	// user2 deposits 10,000 mDAI
	transaction = await spectre.connect(user2).deposit(mDAI.address, amount);
	result = await transaction.wait();
	console.log(`Deposited ${amount} mDAI from ${user2.address}\n`);

	// ------------------------------------------------------
	// ------- ****** ------- ORDERS -------- ****** --------
	// ------------------------------------------------------
	let orderId;

	// ------------------- A CANECL ORDER -------------------
	// user1 makes an order to get mDAI tokens | user1 wants to pay 5 SPEC for 100 mDAI | user1 wants to have 100 mDAI
	transaction = await spectre.connect(user1).makeOrder(mDAI.address, convertTokens(100), spectreToken.address, convertTokens(5));
	result = await transaction.wait();
	console.log(`Made an order from ${user1.address}`);

	// user1 cancels the order
	orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	transaction = await spectre.connect(user1).cancelOrder(orderId);
	result = await transaction.wait();
	console.log(`Cancelled the order from ${user1.address}\n`);

	// wait for 1 second
	await wait(1);

	// ------------------- FILLED ORDERS -------------------
	// user1 makes an order to get mDAI tokens | user1 wants to pay 10 SPEC for 100 mDAI | user1 wants to have 100 mDAI
	transaction = await spectre.connect(user1).makeOrder(mDAI.address, convertTokens(100), spectreToken.address, convertTokens(10));
	result = await transaction.wait();
	orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	console.log(`Made an order from ${user1.address} | Order ID: ${orderId}`);

	// user2 fills the order (created by user1)
	transaction = await spectre.connect(user2).fillOrder(orderId);
	result = await transaction.wait();
	console.log(`Filled the order by ${user2.address} | Filled Order ID: ${orderId}`);

	// wait for 1 second
	await wait(1);

	// user1 makes an order to get mDAI tokens | user1 wants to pay 25 SPEC for 50 mDAI | user1 wants to have 50 mDAI
	transaction = await spectre.connect(user1).makeOrder(mDAI.address, convertTokens(50), spectreToken.address, convertTokens(25));
	result = await transaction.wait();
	orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	console.log(`Made an order from ${user1.address} | Order ID: ${orderId}`);

	// user2 fills the order (created by user1)
	transaction = await spectre.connect(user2).fillOrder(orderId);
	result = await transaction.wait();
	console.log(`Filled the order by ${user2.address} | Filled Order ID: ${orderId}`);

	// wait for 1 second
	await wait(1);

	// user1 makes an order to get mDAI tokens | user1 wants to pay 80 SPEC for 700 mDAI | user1 wants to have 700 mDAI
	transaction = await spectre.connect(user1).makeOrder(mDAI.address, convertTokens(700), spectreToken.address, convertTokens(80));
	result = await transaction.wait();
	orderId = result.events[0].args.id; // get the orderId from the "Order Event"
	console.log(`Made an order from ${user1.address} | Order ID: ${orderId}`);

	// user2 fills the order (created by user1)
	transaction = await spectre.connect(user2).fillOrder(orderId);
	result = await transaction.wait();
	console.log(`Filled the order by ${user2.address} | Filled Order ID: ${orderId}`);

	// wait for 1 second
	await wait(1);

	// ------------------- OPEN ORDERS -------------------

	// user1 makes 12 orders
	for (let i = 1; i <= 12; i++) {
		transaction = await spectre.connect(user1).makeOrder(mDAI.address, convertTokens(i * 10 + 10), spectreToken.address, convertTokens(10));
		result = await transaction.wait();
		console.log(`Made an order from ${user1.address}`);

		// wait for 1 second
		await wait(1);
	}

	// user2 makes 12 orders
	for (let i = 1; i <= 12; i++) {
		transaction = await spectre.connect(user2).makeOrder(spectreToken.address, convertTokens(10), mDAI.address, convertTokens(i * 10 + 10));
		result = await transaction.wait();
		console.log(`Made an order from ${user2.address}`);

		// wait for 1 second
		await wait(1);
	}
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
