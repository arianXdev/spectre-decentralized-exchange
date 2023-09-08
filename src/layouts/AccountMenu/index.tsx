import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "~/state/hooks";
import { Overlay, Icon } from "~/components";

import { disconnected } from "~/state/connection/connectionSlice";

import Blockies from "react-18-blockies";
import copy from "clipboard-copy";

import deployed from "~/data/deployed.json";
import { toast } from "react-hot-toast";

import "./AccountMenu.scss";

type AccountMenuProps = {
	isOpen: boolean;
	onClose: () => void;
};

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
		const explorerURL = `${deployed[chainId].explorerURL}address/${account}`;
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
							<Icon name="cash-outline" />
							<span>Balance:</span>
							<small>{balance ? Number(balance)?.toFixed(4) : "00.00"} ETH</small>
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
