import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ExecutionsPage from "./pages/ExecutionsPage.jsx";
import ScriptsPage from "./pages/ScriptsPage.jsx";
import Layout from "./layouts/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ScriptPage from "./pages/ScriptPage.jsx";

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
        <Route path="script" element={<ScriptPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
