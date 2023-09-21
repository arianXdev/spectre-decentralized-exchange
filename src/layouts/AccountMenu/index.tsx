import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "~/state/hooks";
import { Overlay, Icon } from "~/components";

import { disconnected } from "~/state/connection/connectionSlice";

import Blockies from "react-18-blockies";
import copy from "clipboard-copy";

import { DeployedData } from "~/data/types";
import deployed from "~/data/deployed.json";

import { toast } from "react-hot-toast";
import "animate.css";

import "./AccountMenu.scss";

type AccountMenuProps = {
	isOpen: boolean;
	onClose: () => void;
};

enum NetworksChainId {
	Sepolia = "11155111",
	Goerli = "5",
	Polygon = "80001",
	BSC = "97",
	Localhost = "31337",
}

const AccountMenu = ({ isOpen, onClose }: AccountMenuProps) => {
	const dispatch = useAppDispatch();

	// Get the account address from the Redux store
	const account = useAppSelector((state) => state.connection.current?.account);

	// Get the account balance from the Redux store
	const balance = useAppSelector((state) => state.connection.current?.balance);

	// Get the current network's chain ID
	const chainId = useAppSelector((state) => state.connection.current?.chainId);

	const [accountAddress, setAccountAddress] = useState<string>("0x000...0000");

	const handleViewOnExplorer = () => {
		const explorerURL = `${(deployed as DeployedData)[chainId].explorerURL}address/${account}`;
		// Redirect the user to another web page
		window.open(explorerURL, "_blank");
	};

	const handleDisconnect = async () => {
		toast(
			(t) => (
				<div className="toast--flex">
					<p>
						Are you sure that you want to<small style={{ color: "var(--red-color)", marginInline: ".3rem" }}>disconnect</small>
						your account?
					</p>

					<button
						className="toast-btn toast-btn--confirm"
						onClick={() => {
							dispatch(disconnected());
							onClose();

							toast.dismiss(t.id);
							toast.success("Your account has been disconnected.");
						}}
					>
						Yes!
					</button>
					<button className="toast-btn toast-btn--dismiss" onClick={() => toast.dismiss(t.id)}>
						Dismiss
					</button>
				</div>
			),
			{
				icon: <Icon name="alert" />,
			}
		);
	};

	const onAccountAddressCopied = () => {
		if (account) {
			const wasCopySuccessful = copy(account);
			wasCopySuccessful.then(() => setAccountAddress("Copied!")).catch(() => setAccountAddress("Couldn't copy!"));

			setTimeout(() => {
				setAccountAddress(`${account?.substring(0, 6) || "0x000"}...${account?.substring(38, 42) || "0000"}`);
			}, 2500);
		}
	};

	useEffect(() => {
		if (account) setAccountAddress(`${account?.substring(0, 6) || "0x000"}...${account?.substring(38, 42) || "0000"}`);
	}, [account]);

	return (
		<>
			<aside className={`account-menu ${isOpen ? "open" : ""}`}>
				<div className="account-menu__wrapper">
					<div className="account-menu__header">
						<figure className="account-menu__figure">
							<Blockies
								seed={account ? account.toString() : accountAddress}
								className="account-menu__avatar"
								size={10}
								scale={4.5}
								color="#0030ab"
								bgColor="#F1F2F9"
								spotColor="#767F92"
							/>
						</figure>

						<div className="account-menu__address" onClick={onAccountAddressCopied}>
							<p>{account ? accountAddress : "Connect your wallet!"}</p>
							<Icon name="copy-outline" />
						</div>

						<div className="account-menu__button-group">
							<button className="account-menu__view" title="View on Explorer" onClick={handleViewOnExplorer}>
								<Icon name="earth" />
							</button>

							<button className="account-menu__disconnect" title="Disconnect" onClick={handleDisconnect}>
								<Icon name="power" />
							</button>
						</div>
					</div>

					<div className="account-menu__body">
						<div className="account-menu__balance">
							<div>
								<i className="fa-brands fa-ethereum"></i>
								<span>Balance:</span>
							</div>
							<small>
								{balance ? Number(balance)?.toFixed(4) : "00.00"}{" "}
								{String(chainId) === NetworksChainId.BSC
									? "BNB"
									: String(chainId) === NetworksChainId.Polygon
									? "MATIC"
									: "ETH"}
							</small>
						</div>
					</div>

					<div className="account-menu__footer">
						<p className="account-menu__paragraph">
							{"</"} Created with <i className="fa-solid fa-heart animate__animated animate__heartBeat animate__infinite"></i>{" "}
							and <i className="fa-solid fa-mug-saucer"></i> {"  "}
							by{" "}
							<a
								href={`https://linkedin.com/in/${import.meta.env.VITE_ARIAN_SOCIAL_LINKEDIN}`}
								target="_blank"
								className="account-menu__arian-name"
							>
								{import.meta.env.VITE_ARIAN_NAME}
							</a>
							{">"}
						</p>

						<div className="account-menu__social">
							<a href={`https://linkedin.com/in/${import.meta.env.VITE_ARIAN_SOCIAL_LINKEDIN}`} target="_blank">
								<Icon name="logo-linkedin" />
							</a>
							<a href={`https://github.com/${import.meta.env.VITE_ARIAN_SOCIAL_GITHUB}`} target="_blank">
								<Icon name="logo-github" />
							</a>
							<a href={`https://npmjs.com/~${import.meta.env.VITE_ARIAN_SOCIAL_NPM}`} target="_blank">
								<Icon name="logo-npm" />
							</a>
							<a href={`https://stackoverflow.com/users/${import.meta.env.VITE_ARIAN_SOCIAL_STACKOVERFLOW}`} target="_blank">
								<Icon name="logo-stackoverflow" />
							</a>
						</div>
					</div>
				</div>
			</aside>

			<div className={`close-menu ${isOpen ? "open" : ""}`} onClick={onClose}>
				<button className="close-menu__btn">
					<i className="fa-solid fa-angles-right"></i>
				</button>
			</div>

			<Overlay isOpen={isOpen} onClose={onClose} accountMenu={true} />
		</>
	);
};

export default AccountMenu;
