"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import TypingWords from "./TypingWords";

const Hero = () => {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center justify-between rounded-lg w-[100vw]">
      <div
        className="md:w-2/3"
        data-aos="fade-right"
        data-aos-duration="2000"
        data-aos-anchor-placement="center-bottom"
      >
        <h1 className="text-[2.8vw] font-bold mb-[0.5vw] text-black flex items-center gap-2">
          FIND YOUR <TypingWords /> JOB.
        </h1>
        <p className="text-gray-700 text-[1.9vw] font-sans mb-[0.8vw]">
          Leverage your career with AI-powered job matching and CV scoring.
        </p>
        <p className="text-[#577C8E] text-[1.1vw] font-sans mb-[1.8vw]">
          Your smartest AI partner for career growth.
        </p>

        <button
          className="relative inline-flex items-center justify-center px-[3vw] py-[1vw] text-[1.2vw] text-white font-semibold rounded-full bg-gradient-to-r from-[#577C8E] to-[#3A5566] shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 group overflow-hidden"
          data-aos="zoom-in"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="600"
          data-aos-duration="1200"
          onClick={() => {
            const target = document.getElementById("opportunity-form");
            if (!target) return;

            const yOffset = 2240;
            const targetPosition =
              target.getBoundingClientRect().top + window.pageYOffset + yOffset;

            const start = window.pageYOffset;
            const distance = targetPosition - start;
            const duration = 2500;
            let startTime: number | null = null;

            const easeInOutQuad = (t: number) =>
              t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            const animateScroll = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const timeElapsed = timestamp - startTime;
              const progress = Math.min(timeElapsed / duration, 1);
              const ease = easeInOutQuad(progress);

              window.scrollTo(0, start + distance * ease);

              if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
              }
            };

            requestAnimationFrame(animateScroll);
          }}
        >
          <span className="absolute inset-0 rounded-full animate-pulse bg-[#6fa0b2] opacity-10"></span>
          <span className="relative z-10">🚀 Coba Sekarang</span>
        </button>
      </div>

      <div
        className="flex justify-center mt-[1vw] md:mt-0"
        data-aos="fade-left"
        data-aos-duration="800"
      >
        <div className="w-[30vw] bg-transparent rounded-lg flex items-center justify-center relative">
          <Image
            src="/office-pict.jpg"
            alt="Hero Image"
            width={800}
            height={800}
            className="ml-[0.5vw]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
