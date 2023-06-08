import axios from "axios";

const URL = "https://api.gasprice.io/v1/estimates";

// @desc Get Ethereum Gas Price
// @route GET https://api.gasprice.io/v1/estimates
export const getGasFee = () => {
	return axios
		.get(URL, {
			headers: { accept: "application/json" },
		})
		.then(({ data: { result } }) => result)
		.catch((error) => console.log(error));
};
