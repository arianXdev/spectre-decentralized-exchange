export const options = {
	chart: {
		animations: { enabled: true },
		width: "100%",
		fontFamily: "Ubuntu",
		toolbar: {
			show: true,
			offsetX: 0,
			offsetY: 0,
			tools: {
				download: false,
				selection: true,
				zoom: true,
				zoomin: true,
				zoomout: true,
				pan: true,
				customIcons: [],
			},
		},
	},
	tooltip: {
		enabled: true,
		theme: false,
		style: {
			fontSize: "16px",
			fontFamily: "Ubuntu",
		},
		x: {
			show: false,
			format: "dd MMM",
			formatter: undefined,
		},
		y: {
			show: true,
			title: "price",
		},
		marker: {
			show: false,
		},
		items: {
			display: "flex",
		},
		fixed: {
			enabled: false,
			position: "topRight",
			offsetX: 0,
			offsetY: 0,
		},
	},
	grid: {
		show: true,
		borderColor: "#767F92",
		strokeDashArray: 0,
	},
	plotOptions: {
		candlestick: {
			colors: {
				// upward: "#25CE8F",
				upward: "#25CE8F",
				// downward: "#F45353",
				downward: "#bd183f",
			},
		},
	},
	xaxis: {
		type: "datetime",
		labels: {
			show: true,
			style: {
				colors: "#767F92",
				fontSize: "14px",
				fontFamily: "Ubuntu",
				cssClass: "apexcharts-xaxis-label",
			},
		},
	},
	yaxis: {
		labels: {
			show: true,
			minWidth: 0,
			maxWidth: 160,
			style: {
				color: "#F1F2F9",
				fontSize: "16px",
				fontFamily: "Ubuntu Mono",
				fontWeight: "500",
				cssClass: "apexcharts-yaxis-label",
			},
			offsetX: -15,
			offsetY: 0,
			rotate: 0,
		},
	},
};

// a temporary placeholder for demonstration
export const dummySeries = [
	{
		data: [
			[24.01, [6593.34, 6600, 6582.63, 6600]], // represents a candle
			[25.01, [6600, 6604.76, 6590.73, 6593.86]],
			[26.01, [6593.86, 6625.76, 6590.73, 6620.0]],
			[27.01, [6620.0, 6604.76, 6590.73, 6605.86]],
			[28.01, [6605.86, 6604.76, 6590.73, 6590.75]],
			[29.01, [6590.75, 6604.76, 6590.73, 6582.1]],
			[30.01, [6582.1, 6604.76, 6516.73, 6550.1]],
			[31.01, [6550.1, 6604.76, 6550.73, 6600.23]],
			[32.01, [6600.23, 6604.76, 6590.73, 6652.89]],
			[33.01, [6652.89, 6670.0, 6632.89, 6660.89]],
			[34.01, [6660.89, 6670.0, 6632.89, 6650.89]],
			[35.01, [6650.89, 6670.0, 6632.89, 6638.89]],
			[36.01, [6638.89, 6670.0, 6598.89, 6618.89]],
		],
	},
];
