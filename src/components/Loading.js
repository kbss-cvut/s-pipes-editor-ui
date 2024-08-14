import React from "react";
import Spinner from "./spinner/Spinner";
import { DelayRender } from "./DelayRender";

const Loading = DelayRender(Spinner, 400);

export default Loading;
