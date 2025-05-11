"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />

      <main className="bg-white flex-grow py-[25vh] px-[13vw]">
        <div className="max-w-[80vw] mx-auto">
          <h1
            className="text-[3vw] font-righteous font-bold text-center mb-[4vw] text-[#3A5566]"
            data-aos="fade-down"
            data-aos-duration="800"
          >
            Tentang{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#577C8E] to-[#3A5566]">
              karir.ai
            </span>
          </h1>

          <section
            className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] text-white p-[4vw] rounded-2xl shadow-xl mb-[6vw]"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="flex items-center mb-[2vw]">
              <div className="rounded-full bg-white p-[1vw] mr-[1.5vw]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[2vw] w-[2vw] text-[#3A5566]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
              </div>
              <h2 className="text-[2vw] font-bold">Introducing karir.ai</h2>
            </div>

            <div className="pl-[4.5vw]">
              <p className="mb-[1.5vw] text-[1.2vw]">
                <strong>karir.ai</strong> adalah platform berbasis web yang
                memanfaatkan kecerdasan buatan (AI) untuk membantu individu —
                khususnya fresh graduate dan profesional muda — memahami potensi
                mereka dan menemukan jalur karir yang tepat berdasarkan
                pengalaman dan keahlian yang tertuang dalam resume mereka.
              </p>
              <p className="mb-[1.5vw] text-[1.2vw]">
                Latar belakang dari pengembangan platform ini berasal dari
                masalah <strong>job mismatch</strong> di Indonesia, di mana
                individu bekerja di bidang yang tidak sesuai dengan keahlian,
                minat, atau latar belakang pendidikannya. Fenomena ini berdampak
                pada produktivitas nasional, kebahagiaan individu, dan
                pertumbuhan ekonomi.
              </p>
              <p className="text-[1.2vw]">
                Berdasarkan survei Populix dan data BPS, sebanyak{" "}
                <strong>30% pencari kerja</strong> di Indonesia menyatakan bahwa
                latar belakang pendidikan mereka tidak sesuai dengan pekerjaan
                yang mereka lamar. Dengan permasalahan tersebut,{" "}
                <strong>karir.ai</strong> hadir sebagai solusi inovatif berbasis
                AI.
              </p>
            </div>
          </section>

          <section
            className="bg-white border-2 border-[#3A5566] text-[#3A5566] p-[4vw] rounded-2xl shadow-lg mb-[6vw]"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <div className="flex items-center mb-[2vw]">
              <div className="rounded-full bg-[#3A5566] p-[1vw] mr-[1.5vw]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[2vw] w-[2vw] text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-[2vw] font-bold">
                Permasalahan yang Ingin Diselesaikan
              </h2>
            </div>

            <div className="pl-[4.5vw]">
              <ul className="space-y-[1vw]">
                {[
                  "Membantu individu memahami keterampilan utama yang dimiliki berdasarkan isi resume mereka.",
                  "Mencocokkan pengalaman dan keterampilan dengan lowongan kerja secara cerdas dan otomatis.",
                  "Memberikan rekomendasi jalur karir yang sesuai dengan profil pengguna melalui AI.",
                  "Meningkatkan pemahaman individu terhadap potensi dan arah karirnya.",
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-[1.2vw]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[1.5vw] w-[1.5vw] text-[#577C8E] mr-[1vw] mt-[0.2vw] flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] text-white p-[4vw] rounded-2xl shadow-xl mb-[6vw]"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="1000"
          >
            <div className="flex items-center mb-[2vw]">
              <div className="rounded-full bg-white p-[1vw] mr-[1.5vw]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[2vw] w-[2vw] text-[#3A5566]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h2 className="text-[2vw] font-bold">Solusi yang Diberikan</h2>
            </div>

            <div className="pl-[4.5vw]">
              <p className="mb-[1.5vw] text-[1.2vw]">
                karir.ai menyediakan fitur-fitur utama seperti:
              </p>
              <ul className="space-y-[1vw]">
                {[
                  "🔍 Analisis resume menggunakan Natural Language Processing (NLP)",
                  "📊 Penilaian kualitas resume berdasarkan diksi, struktur, dan kekuatan bahasa",
                  "🎯 Rekomendasi pekerjaan dan jalur karir yang paling relevan dengan pengguna",
                  "💼 Pencocokan otomatis dengan lowongan kerja berbasis AI",
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-[1.2vw]">
                    <div className="bg-white bg-opacity-20 rounded-full p-2 mr-[1vw] flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[1vw] w-[1vw] text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            className="bg-white border-2 border-[#3A5566] text-[#3A5566] p-[4vw] rounded-2xl shadow-lg mb-[6vw]"
            data-aos="fade-up"
            data-aos-delay="600"
            data-aos-duration="1000"
          >
            <div className="flex items-center mb-[2vw]">
              <div className="rounded-full bg-[#3A5566] p-[1vw] mr-[1.5vw]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[2vw] w-[2vw] text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h2 className="text-[2vw] font-bold">Meet Our Developers</h2>
            </div>

            <div className="pl-[4.5vw]">
              <p className="mb-[1.5vw] text-[1.2vw] font-medium">
                ✨ Behind every great innovation, there&apos;s a passionate
                team! ✨
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-[2vw] mb-[2vw]">
                {[
                  {
                    name: "Septian Eka Rahmadi",
                    id: "22/496732/TK/54442",
                    github: "https://github.com/septianrahmadi",
                  },
                  {
                    name: "Muhammad Luthfi Attaqi",
                    id: "22/496427/TK/54387",
                    github: "https://www.linkedin.com/in/muhammad-luthfi-attaqi/",
                  },
                  {
                    name: "Shafa Aura Yogadiasa",
                    id: "22/496508/TK/54406",
                    github: "http://linkedin.com/in/shafaaurayogadiasa",
                  },
                ].map((dev, index) => (
                  <a
                    key={index}
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div
                      className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] p-[1.5vw] rounded-xl text-white text-center hover:shadow-2xl transition-all duration-300"
                      data-aos="zoom-in"
                      data-aos-delay={800 + index * 200}
                    >
                      <div className="bg-white rounded-full w-[6vw] h-[6vw] mx-auto mb-[1vw] relative overflow-hidden">
                        <Image
                          src={`/developer${index + 1}.jpg`}
                          alt={dev.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <h3 className="text-[1.3vw] font-bold mb-[0.5vw]">
                        {dev.name}
                      </h3>
                      <p className="text-[1vw] bg-white bg-opacity-20 rounded-lg py-[0.5vw] px-[1vw]">
                        {dev.id}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="text-center bg-[#3A5566] bg-opacity-10 p-[2vw] rounded-xl">
                <p className="text-[1.2vw] mb-[1vw]">
                  🎯 Proyek ini dikembangkan dalam rangka Tugas Akhir Senior
                  Project TI
                </p>
                <p className="text-[1.2vw] font-medium">
                  📍 Departemen Teknologi Elektro dan Teknologi Informasi,
                  Fakultas Teknik, Universitas Gadjah Mada
                </p>
              </div>
            </div>
          </section>

          <section
            className="bg-gradient-to-br from-[#577C8E] to-[#3A5566] text-white p-[4vw] rounded-2xl shadow-xl text-center mt-[6vw]"
            data-aos="fade-up"
            data-aos-delay="800"
            data-aos-duration="1000"
          >
            <div
              className="bg-white inline-block rounded-full p-[1.5vw] mb-[2vw]"
              data-aos="zoom-in"
              data-aos-delay="1000"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[3vw] w-[3vw] text-[#3A5566]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a4 4 0 118 0v7M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v12a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>

            <h2
              className="text-[2.5vw] font-bold mb-[1.5vw]"
              data-aos="fade-up"
              data-aos-delay="1100"
            >
              Thank You for Choosing Us
            </h2>

            <p
              className="text-[1.5vw] mb-[2vw] max-w-[60vw] mx-auto"
              data-aos="fade-up"
              data-aos-delay="1200"
            >
              Your journey to career excellence starts here. Together,
              we&apos;ll unlock your potential and guide you toward the perfect
              professional path.
            </p>

            <div
              className="flex justify-center space-x-[1vw] mb-[1vw]"
              data-aos="fade-up"
              data-aos-delay="1300"
            >
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[2vw] w-[2vw] text-yellow-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <p
              className="text-[1.2vw] italic"
              data-aos="fade-up"
              data-aos-delay="1400"
            >
              Join karir.ai today and transform your future career
              possibilities!
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
