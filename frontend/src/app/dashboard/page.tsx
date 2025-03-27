"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Home: React.FC = () => {
  // State untuk lokasi & dropdown
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const locations = ["Jakarta", "Yogyakarta", "Surabaya", "Bandung", "Semarang", "Bali"];
  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(selectedLocation.toLowerCase())
  );

  return (
    <div className="bg-[#F5F1EE] text-[#2E2E2E] font-poppins min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
              <div className="flex items-center space-x-2">
                <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} />
        </div>
        <div className="flex space-x-8 font-medium text-lg">
          <Link href="#" className="hover:underline">Analisa Resume</Link>
          <Link href="/joblistsearch" className="hover:underline">Lowongan</Link>
          <Link href="#" className="hover:underline">About</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto py-12 px-8 flex-grow">
        <section className="flex flex-col md:flex-row items-center justify-between bg-[#F5F1EE] p-8 rounded-lg">
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">TEMUKAN POTENSI, GAPAI POSISI</h1>
            <p className="text-gray-700 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="bg-[#577C8E] text-white px-6 py-2 rounded-full">COBA SEKARANG</button>
          </div>
          <div className="md:w-1/2 flex justify-center">
          <div className="w-[300px] h-[300px] rounded-lg flex items-center justify-center">
          <Image src="/gambardashboard.png" alt="Gambar Dashboard" width={300} height={300} />
          </div>
        </div>
        </section>

        {/* Form Section */}
        <section className="bg-[#577C8E] text-white p-8 rounded-lg mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">AYO LIHAT PELUANGMU</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 space-y-4">
              <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border border-gray-300 text-black" />
              <input type="text" placeholder="Nama" className="w-full p-3 rounded-lg border border-gray-300 text-black" />
              <select className="w-full p-3 rounded-lg border border-gray-300 text-black">
                <option>Harapan Lokasi</option>
                <option>Sleman, DIY</option>
              </select>
              <select className="w-full p-3 rounded-lg border border-gray-300 text-black">
                <option>Harapan Pendapatan</option>
                <option>Rp2.000.000 - Rp5.000.000</option>
              </select>
            </div>
            <div className="md:w-1/2 flex flex-col items-center mt-8 md:mt-0">
              <label className="w-[90%] h-36 bg-white rounded-lg border-dashed border-2 border-gray-300 flex flex-col items-center justify-center cursor-pointer">
                <span className="text-gray-500">Unggah Resume</span>
                <input type="file" className="hidden" />
              </label>
              <div className="flex space-x-4 mt-4">
                <button className="bg-[#577C8E] text-white px-6 py-2 rounded-full">LIHAT PELUANG</button>
                <button className="bg-gray-500 text-white px-6 py-2 rounded-full">Detail Kerja</button>
              </div>
            </div>
          </div>
        </section>

        {/* Lowongan Tersedia Section */}
<section className="mt-12 p-6 bg-gray-50 rounded-xl shadow-lg">
  <h2 className="text-3xl font-semibold text-center text-[#333E50] mb-6 tracking-wide">
    LOWONGAN TERSEDIA
  </h2>
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
    <div className="relative w-full md:w-1/2">
      <input 
        type="text" 
        placeholder="Cari Lowongan lainnya" 
        className="w-full p-3 pl-10 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm" 
      />
      <img src="/searchicon.png" alt="Search" className="absolute left-3 top-3 w-5 h-5" />
    </div>
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        placeholder="Filter berdasarkan lokasi"
        className="w-full p-3 pl-10 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      />
      <img src="/locationIcon.png" alt="Location" className="absolute left-3 top-3 w-5 h-5" />
      {showDropdown && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md mt-2 z-10">
          {filteredLocations.map((loc, index) => (
            <div 
              key={index} 
              className="p-3 hover:bg-gray-100 cursor-pointer text-gray-700"
              onClick={() => {
                setSelectedLocation(loc);
                setShowDropdown(false);
              }}
            >
              {loc}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(9)].map((_, index) => (
      <div key={index} className="p-5 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-[#333E50] mb-2">Sales Promotion Boys</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <img src="/companyIcon.png" alt="Company" className="w-5 h-5" />
          <p>PT. Gadjah Mada UKT, TBK</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <img src="/locationIcon.png" alt="Location" className="w-5 h-5" />
          <p>Jalan Bulaksumur, No. 1, Sleman, DIY</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <img src="/timeIcon.png" alt="Time" className="w-5 h-5" />
          <p>Penuh Waktu</p>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <img src="/moneyIcon.png" alt="Money" className="w-5 h-5" />
          <p>Rp2.000.000 - Rp3.500.000 / bulan</p>
        </div>
      </div>
    ))}
  </div>
</section>

      </main>

       {/* Bagaimana Cara Karir.AI Bekerja Section */}
       <section className="mt-12 p-8 bg-[#F8F6F3] rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-8">BAGAIMANA CARA KARIR.AI BEKERJA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="p-4 border border-gray-300 rounded-lg bg-white">
                <h3 className="text-lg font-bold flex items-center">
                  <span className="text-2xl font-extrabold mr-2">{num}</span>
                  LOREM IPSUM DOLOR SIT
                </h3>
                <p className="text-gray-600 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci.
                  Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus.
                </p>
              </div>
            ))}
          </div>
        </section>


      {/* Footer */}
      <footer className="bg-[#2F4157] text-[#F4EFEB] py-6 px-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logokarirtegak.png" alt="Karir.ai logo" width="50" height="50" className="mr-2" />
            <span className="text-xl font-bold">KARIR.AI</span>
          </div>
          <div className="text-center md:text-left">
            <p>Karir.ai adalah produk dari proyek senior UGM.</p>
            <p>Made with ❤️ and ☕ by:</p>
            <p>1. Muhammad Luthfi Attaqi - 22/496427/TK/54387</p>
            <p>2. Septian Eka Rahmadi - 22/496732/TK/54442</p>
            <p>3. Shafa Aura Yogadiasa - 22/496508/TK/54406</p>
          </div>
          <nav className="space-x-8">
            <a href="#" className="text-gray-400 hover:text-gray-200">Analisa Resume</a>
            <a href="/joblistsearch" className="text-gray-400 hover:text-gray-200">Lowongan</a>
            <a href="#" className="text-gray-400 hover:text-gray-200">About</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Home;