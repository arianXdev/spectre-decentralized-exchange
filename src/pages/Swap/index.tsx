import { useContext } from "react";
import { EthersContext } from "~/context";

import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";

import cryptosLogo from "~/helpers/cryptosLogo";

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

	const MY_TOKEN_LIST = [
		{
			name: "SpectreToken",
			address: "0x4aFd39239Dca334F02e9F829700733B4DE048595",
			symbol: "SPEC",
			decimals: 18,
			chainId: 80001,
			logoURI: cryptosLogo.SPEC,
		},
		{
			name: "Mock Ether",
			address: "0xB470Ad2Db961912cAfD49bC2AC64039C0432e547",
			symbol: "mETH",
			decimals: 18,
			chainId: 80001,
			logoURI: cryptosLogo.mETH,
		},
		{
			name: "Mock DAI",
			address: "0x58A036951Dafe3f046C9575e6B26AFDfF5fdF3B8",
			symbol: "mDAI",
			decimals: 18,
			chainId: 80001,
			logoURI: cryptosLogo.mDAI,
		},
		{
			name: "Mock Tether",
			address: "0x49e427EF83A21eBB20Eb97615015cFeEa66f7F29",
			symbol: "mUSDT",
			decimals: 18,
			chainId: 80001,
			logoURI: cryptosLogo.mUSDT,
		},
	];

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
					tokenList={MY_TOKEN_LIST}
				/>
			</div>
		</main>
	);
};

export default Swap;
