import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage.jsx";
import ExecutionsPage from "./pages/Executions/ExecutionsPage.jsx";
import ScriptsPage from "./pages/Script/ScriptsPage.jsx";
import Dagre from "./components/dagre/Dagre.jsx";
import NotFoundPage from "./pages/Error/NotFoundPage.jsx";
import Layout from "./layouts/Layout.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="scripts" element={<ScriptsPage />} />
          <Route path="executions" element={<ExecutionsPage />} />
          <Route path="script" element={<Dagre />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
