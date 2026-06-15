import React, { lazy } from "react";

import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "../components/Errorboundary/ErrorPage";
import Loadable from "../components/loader/Loadable";
import AppLayout from "../components/Layout/AppLayout";

const LoginPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));

const LandingPage = Loadable(
  lazy(() => import("../pages/LandingPage/LandingPage"))
);

const AppRoutes = () => {
  return (
    <HashRouter hashType="slash">
      <Routes>
        <Route exact path="*" element={<ErrorPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
