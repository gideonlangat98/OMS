import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { OmsProvider } from "./components/auth/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <OmsProvider>
      <App />
    </OmsProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

