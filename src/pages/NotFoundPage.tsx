import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className=" text-center position-fixed"
      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      <h1 className="display-4">Oops! Page Not Found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <button className="btn btn-primary mt-3" onClick={handleGoHome}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
