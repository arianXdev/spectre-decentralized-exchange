import { FC } from "react";

import { Icon } from "../..";

import "./AccountMenu.css";

interface AccountMenuProps {
	isOpen: boolean;
	onClose: () => void;
	account: JSX.Element;
}

const AccountMenu: FC<AccountMenuProps> = ({ isOpen, onClose, account }) => {
	return (
		<>
			<aside className={`account-menu ${isOpen ? "open" : ""}`}>
				<div className="account-menu__wrapper">
					<div className="account-menu__header">
						<figure className="account-menu__figure">
							<Icon name="person-circle" />
						</figure>

						<div className="account-menu__address">
							<p>{account}</p>
							<Icon name="copy-outline" />
						</div>

						<button className="account-menu__logout" title="Logout">
							<Icon name="power" />
						</button>
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
