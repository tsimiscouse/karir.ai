"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface Step {
  number: number;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const steps: Step[] = [
    {
      number: 1,
      title: "LOREM IPSUM DOLOR SIT",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus.",
    },
    {
      number: 2,
      title: "LOREM IPSUM DOLOR SIT",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus.",
    },
    {
      number: 3,
      title: "LOREM IPSUM DOLOR SIT",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus.",
    },
    {
      number: 4,
      title: "LOREM IPSUM DOLOR SIT",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus.",
    },
    {
      number: 5,
      title: "LOREM IPSUM DOLOR SIT",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus.",
    },
  ];

  return (
    <section className="p-[4vw] bg-[#F4EFEB] rounded-lg w-full max-w-[70vw] max-h-[35vw] mx-auto justify-center items-center flex flex-col">
      <h2
        className="text-2xl font-bold text-center mb-8 text-black"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        BAGAIMANA CARA KARIR.AI BEKERJA?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="p-4 border-2 rounded-lg bg-white hover:shadow-md transition-shadow border-[#577C8E]"
            data-aos="fade-up"
            data-aos-delay={index * 150}
            data-aos-duration="800"
          >
            <h3 className="text-[1.1vw] font-bold flex items-center mb-3 text-black">
              <span className="text-[1.2vw] font-extrabold mr-2 text-[#577C8E]">
                {step.number}
              </span>
              {step.title}
            </h3>
            <p className="text-gray-600 font-sans text-[0.9vw]">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
