"use client";

import Image from "next/image";
import Link from "next/link";

export default function AnalysisResult() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F3]">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} />
        </div>
        <div className="flex space-x-6 text-lg font-medium text-[#344054]">
          <Link href="/analisa" className="hover:text-gray-600">Analisa Resume</Link>
          <Link href="/joblistsearch" className="hover:text-gray-600">Lowongan</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
        </div>
      </nav>

      <main className="flex-grow p-6 md:p-12 flex flex-col items-center text-[#2F4157]">
        <h1 className="text-4xl font-bold mb-6">Hasil Analisis</h1>
        
        <div className="bg-[#476582] text-white p-6 rounded-lg w-full max-w-3xl text-center">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci...</p>
        </div>

        <p className="mt-6 font-medium">Jenis pekerjaan yang cocok denganmu adalah</p>
        
        <div className="flex space-x-4 mt-4">
          <div className="bg-[#2F4157] text-white px-6 py-2 rounded-lg">Kategori 1</div>
          <div className="bg-[#2F4157] text-white px-6 py-2 rounded-lg">Kategori 2</div>
          <div className="bg-[#2F4157] text-white px-6 py-2 rounded-lg">Kategori 3</div>
        </div>
        
        <h2 className="text-2xl font-bold mt-10">Rekomendasi Lowongan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-5xl">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded-lg">
              <h3 className="font-bold text-[#2F4157]">Sales Promotion Boys</h3>
              <p className="text-sm text-gray-600">PT. Gadjah Mada U.T. TBK</p>
              <p className="text-sm text-gray-600">Jl. Bukaksumur, No.1, Sleman, DIY</p>
              <p className="text-sm text-gray-600">Penuh Waktu</p>
              <p className="text-sm text-[#2F4157] font-bold">Rp2.000.000 - Rp3.500.000 / bulan</p>
            </div>
          ))}
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
            <a href="/joblistsearch" className="text-gray-400 hover:text-gray-200">Lowongan</a>
            <a href="#" className="text-gray-400 hover:text-gray-200">About</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
