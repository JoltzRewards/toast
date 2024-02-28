import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "@joltzrewards/toast";

ReactDOM.createRoot(document.getElementById("root")).render(
	<ToastProvider>
		<App />
	</ToastProvider>,
);
