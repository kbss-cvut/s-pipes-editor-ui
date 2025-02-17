import React from "react";
import "./Spinner.css";

const sizeMap = {
  small: "40px",
  middle: "60px",
  large: "80px",
};

const Spinner = ({ color = "#3498db", size = "middle", style }) => {
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
