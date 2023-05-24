import { FC } from "react";
import { createPortal } from "react-dom";

import "./Overlay.css";

interface OverlayProps {
	isOpen: boolean;
	onClose: () => void;
	accountMenu: boolean;
}

const Overlay: FC<OverlayProps> = ({ isOpen, onClose = null, accountMenu = false }) => {
	return createPortal(
		<div className={`${!accountMenu ? "overlay" : "overlay--account-menu"} ${isOpen ? "active" : ""}`} onClick={onClose}></div>,
		document?.body as HTMLBodyElement
	);
};

export default Overlay;
