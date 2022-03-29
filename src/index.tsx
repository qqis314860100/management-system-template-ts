import "./wdyr";
import React from "react";
import ReactDOM from "react-dom";
import { AppProvider } from "context";
import "antd/dist/antd.min.css";
import AppRoot from "routes";
import "./global.less";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <AppRoot />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
