import { FC } from "react";

import { useAppSelector } from "../../app/hooks";
import { Icon } from "..";

import Blockies from "react-18-blockies";

import "./AccountMenu.css";

interface AccountMenuProps {
	isOpen: boolean;
	onClose: () => void;
	account: JSX.Element | string;
}

const AccountMenu: FC<AccountMenuProps> = ({ isOpen, onClose, account }) => {
	// Get the account balance from the Redux store
	const balance = useAppSelector((state) => state.connection.current?.balance);

	return (
		<>
			<aside className={`account-menu ${isOpen ? "open" : ""}`}>
				<div className="account-menu__wrapper">
					<div className="account-menu__header">
						<figure className="account-menu__figure">
							<Blockies
								seed={account.toString()}
								className="account-menu__avatar"
								size={10}
								scale={4.5}
								color="#0030ab"
								bgColor="#F1F2F9"
								spotColor="#767F92"
							/>
						</figure>

						<div className="account-menu__address">
							<p>{account}</p>
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
