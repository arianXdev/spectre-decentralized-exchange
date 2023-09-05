import axios from "axios";

const URL = "https://min-api.cryptocompare.com/data/price";

// @desc Get Ether Price
// @route GET https://min-api.cryptocompare.com/data/price
export const getETHPrice = () => {
	return axios
		.get(URL, {
			params: {
				fsym: "ETH",
				tsyms: "USD",
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};
