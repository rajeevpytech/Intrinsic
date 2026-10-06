import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { capabilities } from "../mock/mock";
import { slugify } from "../components/WhatWeDo";
import { Logo } from "../components/common";
import brandWhite from "../assets/logo-icon-white.png";

const ComingSoon = () => {
  const { slug } = useParams();
  const svc = capabilities.find((c) => slugify(c.title) === slug);
  const prettify = (s) => (s || "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const name = svc ? svc.title : (slug ? prettify(slug) : "This Service");

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col hero-grain"
      style={{
        background:
          "linear-gradient(105deg, #0f4aa3 0%, #1b61be 45%, #2f7ad6 75%, #4a92e6 100%)",
      }}
    >
      <div
        className="absolute -top-1/2 left-1/4 w-[900px] h-[900px] opacity-20 animate-spin-slow pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.14) 40deg, transparent 120deg, rgba(250,175,106,0.12) 220deg, transparent 300deg)",
        }}
      />

      {/* top bar */}
      <header className="container-x relative z-10 py-6">
        <Link to="/" data-testid="coming-soon-logo"><Logo color="#ffffff" size={22} /></Link>
      </header>

      {/* center */}
      <div className="container-x relative z-10 flex-1 flex flex-col items-center justify-center text-center py-16">
        <img src={brandWhite} alt="" className="w-24 h-24 object-contain animate-float-slow mb-8" />
        <p className="eyebrow text-[#f2a91c] mb-5" data-testid="coming-soon-service">{name}</p>
        <h1 className="font-serif font-semibold text-[46px] sm:text-[68px] leading-[1.02]">
          Coming Soon
        </h1>
        <p className="text-white/80 text-[17px] leading-relaxed mt-6 max-w-[560px]">
          We're putting the finishing touches on our {name} page. Check back soon—or talk to our team
          in the meantime.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-amber" data-testid="coming-soon-back">
            <span className="btn-arrow"><ArrowLeft size={14} strokeWidth={2.5} /></span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
