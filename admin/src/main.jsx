import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import axios from "axios";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

axios.defaults.baseURL = import.meta.env.VITE_API;

const theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#000000",
      light: "#FFFFFF",
    },
    secondary: {
      main: "#FF6000",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
