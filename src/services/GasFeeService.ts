import axios from "axios";

const URL = "https://api.owlracle.info/v4/eth/gas";
const API_KEY = import.meta.env.VITE_OWLRACLE_API_KEY;

// @desc Get Ethereum Gas Price
// @route GET https://api.owlracle.info/v4/eth/gas
export const getGasFee = () => {
	return axios
		.get(URL, {
			params: {
				apikey: API_KEY,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};
