'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F0F0E8] text-[#2E2E2E] font-poppins">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} />
        </div>
        <div className="flex space-x-6 text-lg font-medium">
          <Link href="/analisa" className="hover:text-gray-600">Analisa Resume</Link>
          <Link href="/lowongan" className="hover:text-gray-600">Lowongan</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
        </div>
      </nav>

      {/* Success Message */}
      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-[#2E4756] text-white p-8 rounded-lg shadow-lg text-center w-[90%] md:w-[50%] lg:w-[40%]">
          <Image src="/fileberhasil.png" alt="Email Sent" width={50} height={50} className="mx-auto mb-4" />
          <p className="text-lg mb-2">Hasil analisa telah berhasil dikirimkan</p>
          <p className="text-sm mb-6">Cek email anda sekarang untuk melihat history</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-red-600 px-6 py-2 text-white font-semibold rounded-full hover:bg-red-700 transition">
              LIHAT HASIL ANALISIS
            </button>
            <button className="bg-[#5A7684] px-6 py-2 text-white font-semibold rounded-full hover:bg-[#49606E] transition">
              KEMBALI KE HOME
            </button>
          </div>
        </div>
      </main>

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
            <a href="#" className="text-gray-400 hover:text-gray-200">Lowongan</a>
            <a href="#" className="text-gray-400 hover:text-gray-200">About</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default SuccessPage;
