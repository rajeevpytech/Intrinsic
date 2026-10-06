import React from "react";
import { Check } from "lucide-react";
import { Reveal } from "./common";
import { peopleQualities } from "../mock/mock";

const People = () => {
  return (
    <section className="bg-white py-24 lg:py-28" data-testid="people-section">
      <div className="container-x">
        <div className="lg:px-[50px]">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal dir="left">
            <div className="group relative">
              <div className="absolute -top-5 -left-5 w-28 h-28 bg-amber/25 -z-0 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
              <div className="img-zoom relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHRlYW18ZW58MHx8fHwxNzg4ODk1Nzg4fDA&ixlib=rb-4.1.0&q=85"
                  alt="The team responsible for your technology"
                  className="w-full h-[440px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          <Reveal dir="up" delay={120}>
            <h2 className="font-serif text-midnight font-semibold text-[32px] sm:text-[42px] leading-[1.06]">
              The People Responsible for Your Technology
            </h2>
            <p className="text-slatesage text-[16px] leading-relaxed mt-6">
              Behind every secure, well-managed technology environment is a team that understands
              how it operates.
            </p>
            <p className="text-slatesage text-[16px] leading-relaxed mt-4">
              At Intrinsic, clients work with dedicated professionals who understand their business,
              technology environment, and priorities. That continuity creates stronger operational
              knowledge, clearer accountability, and more informed technology management over time.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-9 border-t border-powder pt-8">
              {peopleQualities.map((q) => (
                <div key={q} className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-amber text-midnight shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="font-semibold text-midnight text-[15px]">{q}</span>
                </div>
              ))}
            </div>

            <p className="font-serif text-navy text-[19px] leading-relaxed mt-8">
              A technology relationship built around long-term responsibility for the environment.
            </p>
          </Reveal>
        </div>
        </div>
      </div>
    </section>
  );
};

export default People;
