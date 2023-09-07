import { FC, MouseEvent } from "react";

import "./Overlay.scss";

interface OverlayProps<T extends MouseEvent> {
	isOpen: boolean;
	accountMenu?: boolean;
	onClose?: () => T;
}

const Overlay: FC<OverlayProps> = ({ isOpen, onClose = null, accountMenu = false }) => {
	return <div className={`${!accountMenu ? "overlay" : "overlay--account-menu"} ${isOpen ? "active" : ""}`} onClick={onClose}></div>;
};

export default Overlay;
