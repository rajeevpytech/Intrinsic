import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress } from "../components/common";
import HomeHero from "../components/home/HomeHero";
import HomeWhatWeDo from "../components/home/HomeWhatWeDo";
import HomeSecurity from "../components/home/HomeSecurity";
import HomeIndustries from "../components/home/HomeIndustries";
import HomeContinuity from "../components/home/HomeContinuity";
import HomeResults from "../components/home/HomeResults";
import HomeTestimonials from "../components/home/HomeTestimonials";
import HomePartners from "../components/home/HomePartners";
import HomeCta from "../components/home/HomeCta";

const HomePage = () => (
  <div className="bg-white page-in" data-testid="home-page">
    <ScrollProgress />
    <Navbar />
    <main>
      <HomeHero />
      <HomeWhatWeDo />
      <HomeSecurity />
      <HomeIndustries />
      <HomeContinuity />
      <HomeResults />
      <HomePartners />
      <HomeTestimonials />
      <HomeCta />
    </main>
    <Footer />
  </div>
);

export default HomePage;
