import React from "react";

import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";

const root = createRoot(document.getElementById("root"));
root.render(<Router />);
