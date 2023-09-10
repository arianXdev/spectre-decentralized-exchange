import { useEffect } from "react";

import { BrowserTypes, isFirefox, browserName } from "react-device-detect";

import createLogo from "~/lib/@metamask/logo";
import { Icon } from "../../components";

import "./InstallWallet.scss";

const InstallWallet = () => {
	const MetaMaskForFirefox = "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
	const MetaMaskForChrome = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";

	const onDownloadMetaMaskClicked = () => {
		isFirefox && browserName === BrowserTypes.Firefox
			? window.open(MetaMaskForFirefox, "_blank")
			: window.open(MetaMaskForChrome, "_blank");
	};

	// To render with fixed dimensions:
	const viewer = createLogo({
		pxNotRatio: true,
		width: 300,
		height: 200,
		followMouse: true,
		slowDrift: false,
	});

	useEffect(() => {
		// add viewer to DOM
		const container = document.getElementById("install-wallet__container")!;
		container?.appendChild(viewer.container);

		// look at something on the page
		viewer.lookAt({
			x: 1000,
			y: 1000,
		});

		// enable mouse follow
		viewer.setFollowMouse(true);

		return () => {
			// deallocate nicely
			viewer.stopAnimation();
			container?.removeChild(viewer.container);
		};
	}, []);

	return (
		<main className="install-wallet">
			<div className="install-wallet__container" id="install-wallet__container">
				<div className="install-wallet__wrapper">
					<h2 className="install-wallet__title">
						<Icon name="alert-circle" />
						Please Install MetaMask!
					</h2>

					<p className="install-wallet__desc">
						We noticed that you don't have <small style={{ color: "#da1111", fontWeight: 900 }}>MetaMask</small> wallet
						installed! In order to fully experience all the Spectre DEX features, You need to have MetaMask installed! It's a
						digital wallet for interacting with Ethereum Blockchain apps.
						<a className="install-wallet__readmore" href="https://metamask.io/" target="_blank">
							Read more
						</a>
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
