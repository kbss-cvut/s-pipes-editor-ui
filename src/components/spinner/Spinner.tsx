import React from "react";
import "./Spinner.css";

const sizeMap = {
  small: "40px",
  middle: "60px",
  large: "80px",
};

interface SpinnerProps {
  color?: string;
  size?: string;
  style?: object;
}

const Spinner = ({ color = "#3498db", size = "middle", style }: SpinnerProps) => {
  const spinnerSize = sizeMap[size] || sizeMap.middle;

  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{
          "--size": spinnerSize,
          ...style,
          borderTopColor: color,
        }}
      />
    </div>
  );
};

export default Spinner;
