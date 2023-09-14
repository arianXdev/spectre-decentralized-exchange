import { useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import logo from "~/assets/images/spectre-logo-light.png";
import Typed from "typed.js";

import { Icon } from "~/components";
import "./Landing.scss";

const Landing = () => {
	const dexNameRef = useRef(null);

	useEffect(() => {
		const dexNameTyped = new Typed(dexNameRef.current, {
			strings: [
				"<i>Spectre <span style='font-size: 17px;'>DEX</span></i>",
				"<span>The Future of Web3</span>",
				"<i>Spectre <span style='font-size: 17px;'>DEX</span></i>",
			],
			typeSpeed: 85,
			showCursor: false,
		});

		return () => {
			dexNameTyped.destroy();
		};
	}, []);

	return (
		<main className="landing">
			<div className="container">
				<div className="landing__wrapper">
					<div className="landing__logo">
						<img src={logo} alt="spectre-dex-logo" />
					</div>

					<div className="landing__content-container">
						<h2 className="landing__dex-name" ref={dexNameRef}>
							Spectre DEX
						</h2>
						<h2 className="landing__text">Trade & Swap crypto anonymously</h2>
						<div className="landing__subtext-container">
							<h2 className="landing__subtext">Buy, sell, and swap tokens.</h2>
						</div>

						<div className="landing__actions">
							<Link to="/trade" className="landing__launch-btn">
								LAUNCH APP
								<Icon name="chevron-forward-outline" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="landing__gradient"></div>
			<div className="landing__glow-container">
				<div className="landing__glow"></div>
			</div>
		</main>
	);
};

export default Landing;
