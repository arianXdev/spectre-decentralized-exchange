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
	status: number;
	isConnecting: boolean;
	handleMetaMaskWallet: () => void;
}

const ConnectWallet: FC<ConnectWalletProps> = ({ isOpen, onClose, status, isConnecting, handleMetaMaskWallet }) => {
	const connectWalletTitleRef = useRef(null);
	const connectWalletCreditsRef = useRef(null);
	const connectingToMetaMaskRef = useRef(null);

	// Change text in different stages of connecting to a wallet
	const getStatusText = () => {
		if (status === 0) {
			return ["Connecting to MetaMask..."];
		} else if (status === 1) {
			return ["Connected!"];
		} else if (status === 2) {
			return ["Sorry! Couldn't connect..."];
		} else {
			return ["Sorry! Couldn't connect..."];
		}
	};

	useEffect(() => {
		const connectWalletTitleTyped = new Typed(connectWalletTitleRef.current, {
			strings: ["<i>Connect Your Wallet</i>"],
			typeSpeed: 70,
			showCursor: false,
		});

		// If it is connecting to a wallet, then there's no need to see connectWalletTitle
		if (isConnecting) {
			connectWalletTitleTyped.destroy();
		}

		const connectWalletCreditsTyped = new Typed(connectWalletCreditsRef.current, {
			strings: ["By connecting your wallet, you agree to Spectre DEX terms of Service and consent to its Privacy Policy."],
			typeSpeed: 40,
			startDelay: 3000,
			showCursor: false,
		});

		const connectingToMetaMaskTyped = new Typed(connectingToMetaMaskRef.current, {
			strings: getStatusText(),
			typeSpeed: 70,
			startDelay: 1000,
		});

		return () => {
			connectWalletTitleTyped.destroy();
			connectWalletCreditsTyped.destroy();
			connectingToMetaMaskTyped.destroy();
		};
	}, [isOpen, status, isConnecting]);

	return (
		<>
			<section className={`connect-wallet ${isOpen ? "open" : ""}`}>
				<div className={`connect-wallet__wrapper ${isOpen ? "open" : ""} ${isConnecting ? "isConnecting" : ""}`}>
					<div className={`connect-wallet__title ${isConnecting ? "hide" : ""}`}>
						<Icon name="wallet-outline" />
						<h3 ref={connectWalletTitleRef}>Connect Your Wallet</h3>
					</div>
					<div className={`connect-wallet__container ${isConnecting ? "isConnecting" : ""}`}>
						<article className={`connect-wallet__body  ${isConnecting ? "isConnecting" : ""}`}>
							<img className="connect-wallet__logo" src={MetaMaskLogo} alt="MetaMask" />
							<p ref={connectingToMetaMaskRef}></p>
							<div className={`spinner ${isConnecting && status !== 1 ? "show" : ""}`}></div>
						</article>

						<div className="connect-wallet__wallets">
							<article
								className={`connect-wallet__wallet ${isOpen && !isConnecting ? "show" : "hidden"}`}
								onClick={handleMetaMaskWallet}
							>
								<img className="connect-wallet__logo" src={MetaMaskLogo} alt="MetaMask" />
							</article>
							<article className={`connect-wallet__wallet ${isOpen && !isConnecting ? "show" : "hidden"}`}>
								<img className="connect-wallet__logo" src={WalletConnectLogo} alt="WalletConnect" />
							</article>
							<article className={`connect-wallet__wallet ${isOpen && !isConnecting ? "show" : "hidden"}`}>
								<img className="connect-wallet__logo" src={BinanceWalletLogo} alt="Binance Wallet" />
							</article>
						</div>
					</div>
				</div>

				<p className="connect-wallet__credits" ref={connectWalletCreditsRef}></p>

				<Overlay isOpen={isOpen} onClose={onClose} accountMenu={false} />
			</section>
		</>
	);
};

export default ConnectWallet;
