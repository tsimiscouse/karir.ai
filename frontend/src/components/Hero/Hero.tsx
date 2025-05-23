"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import TypingWords from "./TypingWords";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    AOS.init({ once: false });
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const scrollToForm = () => {
    const target = document.getElementById("opportunity-form");
    if (!target) return;

    const yOffset = isMobile ? -1150 : -760;
    
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - yOffset;
    
    const start = window.pageYOffset;
    const distance = targetPosition - start;
    const duration = isMobile ? 1200 : 1200;
    
    let startTime: number | null = null;
    
    const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    const animateScroll = (timestamp: number | null) => {
      if (!startTime) startTime = timestamp;
      const timeElapsed = (timestamp as number) - (startTime ?? 0);
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      window.scrollTo(0, start + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between rounded-lg w-full px-[0vw] md:px-0">
      <div
        className="w-full md:w-2/3"
        data-aos="fade-right"
        data-aos-duration="2000"
        data-aos-anchor-placement="center-bottom"
      >
        <h1 className="text-[6.2vw] md:text-[2.8vw] font-bold mb-[2vw] md:mb-[0.5vw] text-black flex items-center gap-[1vw] md:gap-[0.5vw]">
          FIND YOUR <TypingWords /> JOB.
        </h1>
        <p className="text-gray-700 text-[4vw] md:text-[1.8vw] font-sans mb-[2vw] md:mb-[0.8vw]">
          Leverage your career with AI-powered job matching and CV scoring.
        </p>
        <p className="text-[#577C8E] text-[3vw] md:text-[1.1vw] font-sans mb-[4vw] md:mb-[1.8vw]">
          Your smartest AI partner for career growth.
        </p>
        <button
          className="relative inline-flex items-center justify-center w-full mt-[3vh] md:mt-0 md:w-auto px-[6vw] md:px-[3vw] py-[3vw] md:py-[1vw] text-[3.5vw] md:text-[1.2vw] text-white font-semibold rounded-full bg-gradient-to-r from-[#577C8E] to-[#3A5566] shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 group overflow-hidden"
          data-aos="zoom-in"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="600"
          data-aos-duration="1200"
          onClick={scrollToForm}
        >
          <span className="absolute inset-0 rounded-full animate-pulse bg-[#6fa0b2] opacity-10"></span>
          <span className="relative z-10">🚀 Coba Sekarang</span>
        </button>
      </div>
      <div
        className="flex justify-center mb-[8vw] md:mb-[1vw] w-full md:w-auto"
        data-aos="fade-left"
        data-aos-duration="800"
      >
        <div className="w-[80vw] md:w-[30vw] bg-transparent rounded-lg flex items-center justify-center relative">
          <Image
            src="/office-pict.jpg"
            alt="Hero Image"
            width={800}
            height={800}
            className="w-full h-auto ml-0 md:ml-[0.5vw] rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;