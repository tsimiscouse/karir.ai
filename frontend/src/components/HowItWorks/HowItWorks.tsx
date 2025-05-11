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
      title: "UPLOAD RESUME",
      description:
        "Langkah pertama adalah mengisi formulir data diri secara lengkap dan mengunggah resume terbaru Anda ke sistem karir.ai sebagai dasar analisis yang akurat dan personal.",
    },
    {
      number: 2,
      title: "RESUME AI ANALYSIS",
      description:
        "Resume Anda akan diproses secara otomatis oleh teknologi AI kami untuk menganalisis latar belakang pendidikan, pengalaman kerja, serta keahlian yang Anda miliki secara menyeluruh.",
    },
    {
      number: 3,
      title: "JOB MATCHING",
      description:
        "Berdasarkan hasil analisis resume, Anda akan mendapatkan rekomendasi pekerjaan yang sesuai dengan profil Anda dari berbagai lowongan yang tersedia setiap harinya di platform kami.",
    },
    {
      number: 4,
      title: "RESUME SCORE",
      description:
        "Setelah dianalisis, sistem akan memberikan skor objektif terhadap resume Anda, lengkap dengan saran perbaikan agar resume Anda semakin menonjol di mata perekrut profesional.",
    },
    {
      number: 5,
      title: "YOUR NEXT STEP",
      description:
        "Gunakan hasil rekomendasi pekerjaan dan feedback resume untuk segera mengambil langkah berikutnya dalam perjalanan karier Anda melalui fitur Job Listing yang kami sediakan.",
    },
  ];

  return (
    <section className="p-[10vw] py-[15vw] md:p-[4vw] bg-[#F4EFEB] rounded-lg w-full max-w-full md:max-w-[70vw] min-h-[35vw] md:max-h-[35vw] mx-auto justify-center items-center flex flex-col">
      <h2
        className="text-[5vw] md:text-[2vw] font-bold text-center mb-[6vw] md:mb-[2vw] text-black"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        BAGAIMANA CARA KARIR.AI BEKERJA?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[4vw] md:gap-[2vw]">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="p-[4vw] md:p-[1vw] border-2 rounded-lg bg-white hover:shadow-md transition-shadow border-[#577C8E]"
            data-aos="fade-up"
            data-aos-delay={index * 150}
            data-aos-duration="800"
          >
            <h3 className="text-[4vw] md:text-[1.1vw] font-bold flex items-center mb-[3vw] md:mb-[1vw] text-black">
              <span className="text-[4.5vw] md:text-[1.2vw] font-extrabold mr-[2vw] md:mr-[1vw] text-[#577C8E]">
                {step.number}
              </span>
              {step.title}
            </h3>
            <p className="text-gray-600 font-sans text-[3.5vw] md:text-[0.9vw]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
