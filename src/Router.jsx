import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./components/Home.jsx";
import Scripts from "./components/Scripts.jsx";
import Executions from "./components/Executions.jsx";
import NoMatch from "./components/NoMatch.jsx";
import Dagre from "./components/dagre/Dagre.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="scripts" element={<Scripts />} />
        <Route path="executions" element={<Executions />} />
        <Route path="*" element={<NoMatch />} />
        <Route path="script" element={<Dagre />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
