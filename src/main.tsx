import ReactDOM from "react-dom/client";
import App from "./pages/App";

import { BrowserRouter } from "react-router-dom";

import { store } from "./app/store";
import { Provider } from "react-redux";

import "./sass/main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
);
