const { ethers } = require("hardhat");

const convertTokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Spectre Exchange", () => {
	let spectre, tether, spectreToken, accounts, deployer, feeAccount, user1, user2;

	const feePercent = 10; // %10

	beforeEach(async () => {
		const SpectreExchange = await ethers.getContractFactory("Spectre");
		const SpectreToken = await ethers.getContractFactory("SpectreToken");
		const Token = await ethers.getContractFactory("Token");

		// Get all the accounts
		accounts = await ethers.getSigners();
		deployer = await accounts[0];
		feeAccount = await accounts[1];

		// Users / Customers
		user1 = await accounts[2];
		user2 = await accounts[3];

		// Deploy Mock Tether token
		tether = await Token.deploy("Mock Tether", "mUSDT", 1000000);
		// Deploy Spectre Token
		spectreToken = await SpectreToken.deploy();
		// Deploy the exchange contract
		spectre = await SpectreExchange.deploy(feeAccount.address, feePercent);

		// Charge / Give user1 and user2, 100 USDT in order to work with the exchange
		await tether.connect(deployer).transfer(user1.address, convertTokens(100));
		await tether.connect(deployer).transfer(user2.address, convertTokens(100));

		// Charge / Give user1 and user2, 100 SPEC in order to interact with the exchange
		await spectreToken.connect(deployer).transfer(user1.address, convertTokens(100));
		await spectreToken.connect(deployer).transfer(user2.address, convertTokens(100));
	});

	describe("Deployment", () => {
		test("tracks the fee account", async () => {
			expect(await spectre.feeAccount()).toBe(feeAccount.address);
		});

		test("tracks the fee percent", async () => {
			expect(Number(await spectre.feePercent())).toEqual(feePercent);
		});
	});

	describe("Depositing Tokens", () => {
		let transaction, result;
		let amount = convertTokens(10);

		beforeEach(async () => {
			// Approve transfering tokens (First step)
			await spectreToken.connect(user1).approve(spectre.address, amount);
			await tether.connect(user1).approve(spectre.address, amount);

			// Deposit tokens (Second step)
			transaction = await spectre.connect(user1).deposit(spectreToken.address, amount);
			transaction = await spectre.connect(user1).deposit(tether.address, amount);

			result = await transaction.wait();
		});

		test("tracks the SpectreToken (SPEC) deposit", async () => {
			expect(await spectreToken.balanceOf(spectre.address)).toEqual(amount);
			expect(await spectre.balanceOf(spectreToken.address, user1.address)).toEqual(amount);
		});

		test("tracks the Tether (USDT) deposit", async () => {
			expect(await tether.balanceOf(spectre.address)).toEqual(amount);
			expect(await spectre.balanceOf(tether.address, user1.address)).toEqual(amount);
		});

		test("emits a Deposit event", async () => {
			const depositEvent = result.events[1]; // 2 events are emitted
			const args = depositEvent.args;

			expect(depositEvent.event).toBe("Deposit");
			expect(args.token).toEqual(tether.address);
			expect(args.user).toEqual(user1.address);
			expect(args.amount).toEqual(amount);
			expect(args.balance).toEqual(amount); // Check the balance of Spectre DEX
		});
	});

	describe("Withdrawing Tokens", () => {
		let transaction, result;
		let amount = convertTokens(85); // 85 SPEC and USDT

		beforeEach(async () => {
			// **** DEPOSIT TOKENS BEFORE WITHDRAWING ****
			// Approve depositing SPEC tokens
			await spectreToken.connect(user1).approve(spectre.address, amount);
			// Deposit 85 SPEC into the exchange
			await spectre.connect(user1).deposit(spectreToken.address, amount);

			// Approve depositing Mock Tether (USDT) tokens
			await tether.connect(user1).approve(spectre.address, amount);
			// Deposit 85 Mock Tether (USDT) to the exchange
			await spectre.connect(user1).deposit(tether.address, amount);

			// **** WITHDRAW TOKENS ****
			// Withdraw 85 SPEC from the exchange
			transaction = await spectre.connect(user1).withdraw(spectreToken.address, amount);
			result = await transaction.wait();

			// Withdraw 85 USDT from the exchange
			transaction = await spectre.connect(user1).withdraw(tether.address, amount);
			result = await transaction.wait();
		});

		test("should be able to withdraw Mock Tether tokens properly", async () => {
			expect(await tether.balanceOf(user1.address)).toEqual(convertTokens(100));
			expect(await spectre.balanceOf(tether.address, user1.address)).toEqual(convertTokens(0));
		});

		test("should be able to withdraw SPEC tokens properly", async () => {
			expect(await spectreToken.balanceOf(user1.address)).toEqual(convertTokens(100));
			expect(await spectre.balanceOf(spectreToken.address, user1.address)).toEqual(convertTokens(0));
		});

		test("emits a Withdraw event", async () => {
			const withdrawEvent = result.events[1]; // 2 events are emitted
			const args = withdrawEvent.args;

			expect(await withdrawEvent.event).toBe("Withdraw");
			expect(await args.token).toEqual(tether.address);
			expect(await args.user).toEqual(user1.address);
			expect(await args.amount).toEqual(amount);
			expect(await args.balance).toEqual(convertTokens(0));
		});
	});

	describe("Checking Balances", () => {
		let transaction, result;
		let amount = convertTokens(42); // 42 SPEC

		beforeEach(async () => {
			// **** DEPOSIT TOKENS BEFORE WITHDRAWING ****
			await spectreToken.connect(user1).approve(spectre.address, amount);
			await spectre.connect(user1).deposit(spectreToken.address, amount);

			// **** WITHDRAW TOKENS ****
			transaction = await spectre.connect(user1).withdraw(spectreToken.address, convertTokens(22)); // withdrawing 22 SPEC
			result = await transaction.wait();
		});

		test("returns the User balance properly", async () => {
			expect(await spectre.balanceOf(spectreToken.address, user1.address)).toEqual(convertTokens(20));
		});
	});

	describe("Making Orders", () => {
		let transaction, result;
		let amount = convertTokens(1);

		beforeEach(async () => {
			// Aporove Spectre Exchange in order to use transferFrom
			await tether.connect(user1).approve(spectre.address, amount);

			// Deposit USDT into the exchange before making orders
			await spectre.connect(user1).deposit(tether.address, amount);

			// Make the order
			transaction = await spectre.connect(user1).makeOrder(spectreToken.address, amount, tether.address, amount);
			result = await transaction.wait();
		});

		test("tracks the newly created order", async () => {
			expect(Number(await spectre.orderCount())).toStrictEqual(1);
		});

		test("tracks an Order event", async () => {
			const orderEvent = result.events[0];
			const args = orderEvent.args;

			expect(orderEvent.event).toStrictEqual("Order");
			expect(args.id).toEqual(await spectre.orderCount());
			expect(args.user).toEqual(user1.address);
			expect(args.tokenGive).toEqual(tether.address);
			expect(args.amountGive).toEqual(amount);
			expect(args.tokenGet).toEqual(spectreToken.address);
			expect(args.amountGet).toEqual(amount);
			expect(Number(args.timestamp)).toBeGreaterThanOrEqual(1);
		});
	});

	describe("Order actions", () => {
		let transaction, result;
		let amount = convertTokens(1); // 1 mUSDT

		beforeEach(async () => {
			// In order to make an order in the exchange, the user needs to deposit some tokens
			// and in order to deposit some tokens, the user needs to approve and allow the exchange to transferFrom their wallet
			await tether.connect(user1).approve(spectre.address, amount);
			await spectre.connect(user1).deposit(tether.address, amount);

			transaction = await spectre.connect(user1).makeOrder(spectreToken.address, amount, tether.address, amount);
			result = await transaction.wait();
		});

		describe("Cancelling orders", () => {
			beforeEach(async () => {
				transaction = await spectre.connect(user1).cancelOrder(1);
				result = await transaction.wait();
			});

			test("updates cancelled orders", async () => {
				expect(await spectre.cancelledOrders(1)).toEqual(true);
			});

			test("tracks a CancelOrder event", async () => {
				const cancelOrderEvent = result.events[0];
				const args = cancelOrderEvent.args;

				expect(cancelOrderEvent.event).toStrictEqual("CancelOrder");
				expect(args.id).toEqual(await spectre.orderCount());
				expect(args.user).toEqual(user1.address);
				expect(args.tokenGive).toEqual(tether.address);
				expect(args.amountGive).toEqual(amount);
				expect(args.tokenGet).toEqual(spectreToken.address);
				expect(args.amountGet).toEqual(amount);
				expect(Number(args.timestamp)).toBeGreaterThanOrEqual(1);
			});
		});
		describe("Filling orders", () => {});
	});
});
