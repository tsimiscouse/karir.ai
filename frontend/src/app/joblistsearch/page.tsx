"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

export default function JobList() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} />
        </div>
        <div className="flex space-x-6 text-lg font-medium text-[#344054]">
          <Link href="/analisa" className="hover:text-gray-600">Analisa Resume</Link>
          <Link href="/lowongan" className="hover:text-gray-600">Lowongan</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
        </div>
      </nav>

      <main className="bg-[#F8F6F3] flex-grow p-6 md:p-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-[#344054] mb-6">
          CARI LOWONGAN TERSEDIA
        </h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Cari Lowongan lainnya"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 text-[#344054] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
          <button className="p-3 bg-gray-200 rounded-lg flex items-center space-x-2 w-full md:w-auto">
            <span className="text-[#344054]">Filter Berdasarkan Lokasi</span>
            <IoChevronDown className="ml-2 text-gray-600" />
          </button>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(21)].map((_, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg bg-white shadow-md">
              <h3 className="text-lg font-bold text-[#344054] mb-2">Sales Promotion Boys</h3>
              <p className="text-gray-700">PT. Gadjah Mada UKT, TBK</p>
              <p className="text-gray-700">Jalan Bulaksumur, No. 1, Sleman, DIY</p>
              <p className="text-gray-700">Penuh Waktu</p>
              <p className="text-gray-700">Rp2.000.000 - Rp3.500.000 / bulan</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-700">Jumlah: 21 dari 210 Data | Halaman 1</span>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Previous</button>
            <button className="px-4 py-2 bg-[#344054] text-white rounded-lg">Next Page</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2F4157] text-[#F4EFEB] py-6 px-10 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image src="/logokarirtegak.png" alt="Karir.ai logo" width={50} height={50} className="mr-2" />
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
            <a href="#" className="text-gray-400 hover:text-gray-200">Lowongan</a>
            <a href="#" className="text-gray-400 hover:text-gray-200">About</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
