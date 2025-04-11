"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center justify-between rounded-lg">
      <div
        className="md:w-1/2"
        data-aos="fade-right"
        data-aos-duration="2000"
        data-aos-anchor-placement="center-bottom"
      >
        <h1 className="text-3xl font-bold mb-4 text-black">
          TEMUKAN POTENSI, GAPAI POSISI
        </h1>
        <p className="text-gray-700 mb-6 font-sans">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et
          tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae
          imperdiet velit maximus. Duis commodo tincidunt sapien, eu consectetur
          sem. Ut at ullamcorper diam. Vivamus eget porta ex, nec ultrices mi.
        </p>
        <button
          className="bg-[#577C8E] text-white px-6 py-2 rounded-full hover:bg-[#456a7c] transition-colors"
          data-aos="zoom-in"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="600"
          data-aos-duration="1200"
          onClick={() => {
            const target = document.getElementById("opportunity-form");
            if (!target) return;

            const yOffset = -50; 
            const targetPosition =
              target.getBoundingClientRect().top + window.pageYOffset + yOffset;

            const start = window.pageYOffset;
            const distance = targetPosition - start;
            const duration = 1000; // Scroll duration in milliseconds (slow and smooth)
            let startTime: number | null = null;

            const easeInOutQuad = (t: number) => {
              return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            };

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
          Coba Sekarang
        </button>
      </div>
      <div
        className="flex justify-center mt-8 md:mt-0"
        data-aos="fade-left"
        data-aos-duration="800"
      >
        <div className="h-[350px] bg-transparent rounded-lg flex items-center justify-center relative">
          <Image
            src="/briefcase.png"
            alt="Hero Image"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
