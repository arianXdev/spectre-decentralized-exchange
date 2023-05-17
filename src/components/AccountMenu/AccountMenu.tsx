import { FC, useEffect, useState } from "react";

import { useAppSelector } from "../../app/hooks";
import { Icon } from "..";

import Blockies from "react-18-blockies";
import copy from "clipboard-copy";

import "./AccountMenu.css";

interface AccountMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

const AccountMenu: FC<AccountMenuProps> = ({ isOpen, onClose }) => {
	// Get the account address from the Redux store
	const account = useAppSelector((state) => state.connection.current?.account);

	// Get the account balance from the Redux store
	const balance = useAppSelector((state) => state.connection.current?.balance);

	const [accountAddress, setAccountAddress] = useState("0x000...0000");

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

						<button className="account-menu__logout" title="Logout">
							<Icon name="power" />
						</button>
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

			<div className={`overlay ${isOpen ? "active" : ""}`} onClick={onClose}></div>
		</>
	);
};

export default AccountMenu;
