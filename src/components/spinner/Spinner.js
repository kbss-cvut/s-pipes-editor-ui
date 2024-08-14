import React from "react";

const sizeMap = {
  small: "20px",
  middle: "40px",
  large: "60px",
};

const Spinner = ({ color = "#3498db", size = "middle", style }) => {
  const spinnerSize = sizeMap[size] || sizeMap.middle;

  const spinnerKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const defaultStyle = {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderTop: `4px solid ${color}`,
    borderRadius: "50%",
    width: spinnerSize,
    height: spinnerSize,
    animation: "spin 1s linear infinite",
    ...style,
  };

  return (
    <div style={defaultStyle}>
      <style>{spinnerKeyframes}</style>
    </div>
  );
};

export default Spinner;
