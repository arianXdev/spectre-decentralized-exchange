import { ethers } from "ethers";
import _ from "lodash";
import moment from "moment";

import { TokensStateType } from "~/state/tokens/types";
import { OrderType } from "~/state/exchange/types";

// decorates the order passing in (means it adds more details to the order and then returns the decorated order)
export const decorateOrder = (order: OrderType, { token2 }: TokensStateType) => {
	let token1Amount: number | string, token2Amount: number | string;

	// const token1Address = _.get(token1, "address", "");
	const token2Address = _.get(token2, "address", "");

	// EXAMPLE: Giving mETH in exchange for SPEC (the official crypto currency of SPECTRE DEX)
	// SPEC should be considered token1 & mETH is considered as token2
	// NOTE: Crypto Currency symbols are for example purposes in here
	if (order.tokenGive === token2Address) {
		token1Amount = order.amountGive; // the amount of SPEC we are giving
		token2Amount = order.amountGet; // the amount of mETH we want
	} else {
		token1Amount = order.amountGet; // the amount of SPEC we want
		token2Amount = order.amountGive; // the amount of mETH we are giving
	}

	// calculate token price to 5 decimal places
	const precision = 100000;
	let tokenPrice = Number(token1Amount) / Number(token2Amount);
	tokenPrice = Math.round(tokenPrice * precision) / precision;

	const decoratedOrder = {
		...order,
		token1Amount: ethers.formatEther(token1Amount),
		token2Amount: ethers.formatEther(token2Amount),
		tokenPrice,
		formattedTimestamp: moment.unix(order.timestamp).format("h:mm:ssa Y MMM D"),
	};

	return decoratedOrder;
};
