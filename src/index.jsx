import React from "react";
import Router from "./Router.jsx";
import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<Router />);
