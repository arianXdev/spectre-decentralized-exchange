import { useEffect } from "react";

import { BrowserTypes, isFirefox, browserName } from "react-device-detect";

import { Icon, MetaMaskLogo } from "../../components";

import "./InstallWallet.css";

const InstallWallet = () => {
	const MetaMaskForFirefox = "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
	const MetaMaskForChrome = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";

	const onDownloadMetaMaskClicked = () => {
		isFirefox && browserName === BrowserTypes.Firefox
			? window.open(MetaMaskForFirefox, "_blank")
			: window.open(MetaMaskForChrome, "_blank");
	};

	useEffect(() => {
		// Make MetaMask Logo visible
		document.getElementById("logo-container")?.classList.add("visible");
	}, []);

	return (
		<main className="install-wallet">
			<div className="install-wallet__container">
				<MetaMaskLogo />
				<div className="install-wallet__wrapper">
					<div className="install-wallet__title">
						<Icon name="alert-circle" />
						Please Install MetaMask!
					</div>
					<p className="install-wallet__desc">
						We noticed that you don't have <small style={{ color: "#da1111", fontWeight: 900 }}>MetaMask</small> installed! In
						order to fully experience all the Spectre DEX features,{" "}
						<i style={{ color: "var(--gray-color)" }}>You need to have MetaMask installed! </i>
						<span>A digital wallet for interacting with Ethereum Blockchain apps.</span>
					</p>
				</div>

				<div className="downArrow bounce">
					<Icon name="arrow-down-outline" />
				</div>

				<button className="install-wallet__button" onClick={onDownloadMetaMaskClicked}>
					{isFirefox && browserName === BrowserTypes.Firefox ? (
						<>
							<i className="fa-brands fa-firefox"></i>
							<span>Install MetaMask for Firefox</span>
						</>
					) : (
						<>
							<i className="fa-brands fa-chrome"></i>
							<span>Install MetaMask for Chrome</span>
						</>
					)}
				</button>
			</div>
		</main>
	);
};

export default InstallWallet;
