import "./Overlay.scss";

interface OverlayProps {
	isOpen: boolean;
	accountMenu?: boolean;
	onClose?: () => void;
}

const Overlay = ({ isOpen, onClose, accountMenu = false }: OverlayProps) => {
	return <div className={`${!accountMenu ? "overlay" : "overlay--account-menu"} ${isOpen ? "active" : ""}`} onClick={onClose}></div>;
};

export default Overlay;
