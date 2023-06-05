import { FC } from "react";

import "./Overlay.css";

interface OverlayProps {
	isOpen: boolean;
	onClose: () => void;
	accountMenu: boolean;
}

const Overlay: FC<OverlayProps> = ({ isOpen, onClose = null, accountMenu = false }) => {
	return <div className={`${!accountMenu ? "overlay" : "overlay--account-menu"} ${isOpen ? "active" : ""}`} onClick={onClose}></div>;
};

export default Overlay;
