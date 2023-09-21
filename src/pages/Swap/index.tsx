import { useContext } from "react";
import { EthersContext } from "~/context";

import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";

import "./Swap.scss";

const Swap = () => {
	const { Provider } = useContext(EthersContext);

	const jsonRpcUrlMap = {
		11155111: [`https://sepolia.infura.io/v3/${import.meta.env.INFURA_API_KEY}`],
		5: [`https://goerli.infura.io/v3/${import.meta.env.INFURA_API_KEY}`],
		80001: [`https://polygon-mumbai.g.alchemy.com/v2/${import.meta.env.ALCHEMY_POLYGON_API_KEY}`],
	};

	const theme = {
		accent: "#0030ab",
		primary: "#ffffff",
		secondary: "#505050",
		interactive: "#010816",
		module: "#151527",
		dialog: "#010816",
		success: "#088651",
		error: "#bd183f",
		borderRadius: 0,
		fontFamily: '"Ubuntu"',
	};

	return (
		<main className="swap">
			<div className="swap__widget">
				<SwapWidget
					provider={Provider}
					jsonRpcUrlMap={jsonRpcUrlMap}
					brandedFooter={false}
					width={500}
					theme={theme}
					hideConnectionUI={false}
				/>
			</div>
		</main>
	);
};

export default Swap;
