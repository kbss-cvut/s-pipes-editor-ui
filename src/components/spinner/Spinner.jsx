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

  const spinnerStyle = {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderTop: `4px solid ${color}`,
    borderRadius: "50%",
    width: spinnerSize,
    height: spinnerSize,
    animation: "spin 1s linear infinite",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...spinnerStyle, ...style }}></div>
      <style>{spinnerKeyframes}</style>
    </div>
  );
};

export default Spinner;
