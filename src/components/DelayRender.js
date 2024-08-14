import { useEffect, useState } from "react";
import React from "react";

export const DelayRender = (WrappedComponent, delay) => {
  return (props) => {
    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowComponent(true);
      }, delay);

      return () => clearTimeout(timer); // Cleanup on unmount
    }, [delay]);

    return showComponent ? <WrappedComponent {...props} /> : null;
  };
};
