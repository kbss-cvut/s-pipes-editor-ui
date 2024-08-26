import React from "react";
import Spinner from "./spinner/Spinner.jsx";
import { DelayRender } from "./DelayRender.jsx";

const Loading = DelayRender(Spinner, 0);

export default Loading;
