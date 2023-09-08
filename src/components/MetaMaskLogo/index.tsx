import ModelViewer from "@metamask/logo";
import { Component } from "react";

class MetaMaskLogo extends Component {
	viewer: any;
	el: any;

	componentDidMount(): void {
		this.viewer = ModelViewer({
			pxNotRatio: true,
			width: 100,
			height: 100,
			followMouse: true,
		});

		this.el.appendChild(this.viewer.container);
	}

	componentWillUnmount(): void {
		this.viewer.stopAnimation();
	}

	render() {
		return (
			<div
				className="MetaMask-logo"
				ref={(el) => {
					this.el = el;
				}}
			></div>
		);
	}
}

export default MetaMaskLogo;
