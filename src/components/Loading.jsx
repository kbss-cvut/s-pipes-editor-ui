import Spinner from "./spinner/Spinner";
import { DelayRender } from "./DelayRender";

const Loading = DelayRender(Spinner, 300);

export default Loading;
