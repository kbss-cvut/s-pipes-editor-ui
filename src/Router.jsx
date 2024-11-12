import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ExecutionsPage from "./pages/ExecutionsPage.jsx";
import ScriptsPage from "./pages/ScriptsPage.jsx";
import DagrePage from "./pages/dagre/DagrePage.jsx";
import Layout from "./layouts/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="scripts" element={<ScriptsPage />} />
          <Route path="executions" element={<ExecutionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="script" element={<DagrePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
