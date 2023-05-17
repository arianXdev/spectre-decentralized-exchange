import { FC, useEffect, useRef } from "react";

import { Icon, Overlay } from "..";

import MetaMaskLogo from "../../assets/images/metamask.webp";
import WalletConnectLogo from "../../assets/images/wallet-connect.png";
import BinanceWalletLogo from "../../assets/images/binance-wallet.png";

import Typed from "typed.js";

import "./ConnectWallet.css";

interface ConnectWalletProps {
	isOpen: boolean;
	onClose: () => void;
}

const ConnectWallet: FC<ConnectWalletProps> = ({ isOpen, onClose, handleMetaMaskWallet }) => {
	const connectWalletTitleRef = useRef(null);
	const connectWalletCreditsRef = useRef(null);

	useEffect(() => {
		const connectWalletTitleTyped = new Typed(connectWalletTitleRef.current, {
			strings: ["<i>Connect Your Wallet</i>"],
			typeSpeed: 70,
			showCursor: false,
		});

		const connectWalletCreditsTyped = new Typed(connectWalletCreditsRef.current, {
			strings: ["By connecting your wallet, you agree to Spectre DEX terms of Service and consent to its Privacy Policy."],
			typeSpeed: 40,
			startDelay: 3000,
			showCursor: false,
		});

		return () => {
			connectWalletTitleTyped.destroy();
			connectWalletCreditsTyped.destroy();
		};
	}, [isOpen]);

	return (
		<>
			<section className={`connect-wallet ${isOpen ? "open" : ""}`}>
				<div className={`connect-wallet__wrapper ${isOpen ? "open" : ""}`}>
					<div className="connect-wallet__title">
						<Icon name="wallet-outline" />
						<h3 ref={connectWalletTitleRef}>Connect Your Wallet</h3>
					</div>
					<div className="connect-wallet__container">
						<div className="connect-wallet__wallets">
							<article className={`connect-wallet__wallet ${isOpen ? "show" : "hidden"}`} onClick={handleMetaMaskWallet}>
								<img className="connect-wallet__logo" src={MetaMaskLogo} alt="MetaMask" />
							</article>
							<article className={`connect-wallet__wallet ${isOpen ? "show" : "hidden"}`}>
								<img className="connect-wallet__logo" src={WalletConnectLogo} alt="WalletConnect" />
							</article>
							<article className={`connect-wallet__wallet ${isOpen ? "show" : "hidden"}`}>
								<img className="connect-wallet__logo" src={BinanceWalletLogo} alt="Binance Wallet" />
							</article>
						</div>
					</div>
				</div>

				<p className="connect-wallet__credits" ref={connectWalletCreditsRef}></p>

				<Overlay isOpen={isOpen} onClose={onClose} />
			</section>
		</>
	);
};

export default ConnectWallet;
