import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import theme, { cacheRtl } from "./Theme";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";

//this is a simple mathematical method that takes a number and returns 0 if it's less than 0
Math.minimumZero = (number) => {
  if (number <= 0) return 0;
  return number;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ThemeProvider>
  </CacheProvider>
);
