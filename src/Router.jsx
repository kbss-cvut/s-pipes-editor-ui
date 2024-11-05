import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Executions from "./components/Executions.jsx";
import Scripts from "./components/Scripts.jsx";
import Dagre from "./components/dagre/Dagre.jsx";
import NoMatch from "./components/NoMatch.jsx";
import Layout from "./components/Layout.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="scripts" element={<Scripts />} />
          <Route path="executions" element={<Executions />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="script" element={<Dagre />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
