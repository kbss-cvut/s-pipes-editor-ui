import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import HomePage from "@pages/HomePage";
import ExecutionsPage from "@pages/ExecutionsPage";
import ScriptsPage from "@pages/ScriptsPage";
import Layout from "@layouts/Layout";
import NotFoundPage from "@pages/NotFoundPage";
import ScriptPage from "@pages/ScriptPage";

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
