import React, { lazy } from "react";

import { HashRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "../components/Errorboundary/ErrorPage";
import Loadable from "../components/loader/Loadable";
import AppLayout from "../components/Layout/AppLayout";
import PetGallery from "../pages/Gallery/PetGallery/PetGallery";
import Wishlist from "../pages/WishList/Wishlist";
import ScrollToTop from "../utility/ScrollToTop";

const LoginPage = Loadable(lazy(() => import("../pages/Auth/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("../pages/Auth/RegisterPage")));

const LandingPage = Loadable(
  lazy(() => import("../pages/LandingPage/LandingPage"))
);
const AboutUs = Loadable(
  lazy(() => import("../pages/LandingPage/AboutUs/AboutUs"))
);
const Testimonials = Loadable(
  lazy(() => import("../pages/LandingPage/Testimonials/Testimonials"))
);
const Notice = Loadable(
  lazy(() => import("../pages/LandingPage/Notice/Notice"))
);

const AppRoutes = () => {
  return (
    <HashRouter hashType="slash">
      <ScrollToTop>
        <Routes>
          <Route exact path="*" element={<ErrorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/gallery" element={<PetGallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/wish-list" element={<Wishlist />} />
          </Route>
        </Routes>
      </ScrollToTop>
    </HashRouter>
  );
};

export default AppRoutes;
