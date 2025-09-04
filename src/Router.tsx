import React, { Suspense } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Layout from "@layouts/Layout";
import Spinner from "@components/spinner/Spinner";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const ScriptsPage = React.lazy(() => import("./pages/ScriptsPage"));
const ExecutionsPage = React.lazy(() => import("./pages/ExecutionsPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const ScriptPage = React.lazy(() => import("./pages/ScriptPage"));
const ExecutionPage = React.lazy(() => import("./pages/ExecutionPage"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="scripts" element={<ScriptsPage />} />
            <Route path="executions" element={<ExecutionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="script" element={<ScriptPage />} />
          <Route path="execution" element={<ExecutionPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
