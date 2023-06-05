import { FC, useEffect, useRef } from "react";

import Typed from "typed.js";

import { Icon } from "..";

import "./Markets.css";

interface MarketsProps {
	isOpen: boolean;
}

const Markets: FC<MarketsProps> = ({ isOpen, setIsOpen }) => {
	const marketsTitleRef = useRef(null);
	const marketsRef = useRef(null);

	useEffect(() => {
		const marketsTitleTyped = new Typed(marketsTitleRef.current, {
			strings: ["<i>Select A Market</i>"],
			typeSpeed: 70,
			showCursor: false,
		});

		return () => {
			marketsTitleTyped.destroy();
		};
	}, [isOpen]);

	const handleOutsideClick = (event: MouseEvent) => {
		if (event.target === marketsRef.current) {
			setIsOpen((prevState) => !prevState);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<section className={`markets ${isOpen ? "open" : ""}`} ref={marketsRef}>
			<div className={`markets__wrapper ${isOpen ? "open" : ""}`}>
				<div className="markets__title">
					<Icon name="bar-chart-outline" />
					<h3 ref={marketsTitleRef}>Select A Market</h3>
				</div>

				<div className="markets__container">
					<div className="markets__body">
						<ul className="markets__list">
							<li className="markets__item">SPEC / mETH</li>
							<li className="markets__item">SPEC / mDAI</li>
							<li className="markets__item">SPEC / mUSDT</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Markets;
