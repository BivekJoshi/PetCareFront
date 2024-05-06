import React from "react";
import InitialFind from "./InitialFind/InitialFind";
import Service from "./ServicePage/Service";
import AboutUs from "./AboutUs/AboutUs";
import PetStore from "../Product/PetStore";
import RequestSection from "../RequestForm/RequestSection";

const LandingPage = () => {
  return (
    <>
      <InitialFind />
      <Service />
      <AboutUs />
      <PetStore />
      <RequestSection/>
    </>
  );
};

export default LandingPage;
