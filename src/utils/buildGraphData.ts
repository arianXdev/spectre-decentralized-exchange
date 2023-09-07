import _ from "lodash";
import moment from "moment";

import { OrderType } from "~/state/exchange/types";

export const buildGraphData = (orders: { [x: string]: any }) => {
	// group the orders by hour for the graph
	orders = _.groupBy(orders, (o: OrderType) => moment.unix(o.timestamp).startOf("hour").format());

	// get each hour where the actual data exists
	const hours = Object.keys(orders);

	// build the graph series
	const graphData = hours.map((hour) => {
		// fetch all the orders from the current hour
		const group = orders[hour];

		// calculate price values: O, H, L, C
		const open = group[0];
		const high = _.maxBy(group, "tokenPrice");
		const low = _.minBy(group, "tokenPrice");
		const close = group[group.length - 1];

		// console.log(`OPEN: ${open.tokenPrice} | HIGH: ${high.tokenPrice} | LOW: ${low.tokenPrice} | CLOSE: ${close.tokenPrice}`);

		// each candle entry goes here...
		/* 	----> EACH CANDLE SYNTAX WOULD BE LIKE THIS:
			{
				x: time / date,
				y: [O, H, L, C] stands for [OPEN, HIGH, LOW, CLOSE] prices
			}
			- the above object represents a candle!
		*/
		return {
			x: new Date(hour),
			y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
		};
	});

	return graphData;
};
