"use client";

import Image from "next/image";
import Link from "next/link";

export default function EmailVerification() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F3]">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-[#ECEDE8] shadow-md">
        <div className="flex items-center space-x-2">
          <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} />
        </div>
        <div className="flex space-x-6 text-lg font-medium text-[#2F4157]">
          <Link href="/analisa" className="hover:text-gray-600">Analisa Resume</Link>
          <Link href="/joblistsearch" className="hover:text-gray-600">Lowongan</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-[#2F4157] text-center px-4">
        <h1 className="text-2xl font-bold">LANGKAH KE-3 DARI 3</h1>
        <div className="bg-[#2F4157] text-white px-10 py-8 mt-6 rounded-xl shadow-lg w-[90%] md:w-[500px]">
          <p className="mb-4 text-sm">Kami telah mengirimkan kode verifikasi ke email</p>
          <p className="font-semibold text-sm">septianekarahmadi@mail.ugm.ac.id</p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="w-12 h-12 bg-[#476582] rounded-lg"></div>
            <div className="w-12 h-12 bg-[#476582] rounded-lg"></div>
            <div className="w-12 h-12 bg-[#476582] rounded-lg"></div>
            <div className="w-12 h-12 bg-[#476582] rounded-lg"></div>
          </div>
          <p className="mt-6 text-sm">Belum mendapatkan kode?</p>
          <button className="mt-2 px-6 py-3 bg-[#65849B] text-white rounded-lg hover:bg-[#567284]">
            KIRIM ULANG KODE
          </button>
        </div>
        <Link href="/gantiemail">
        <button className="mt-6 px-6 py-3 bg-[#C4C4C4] text-[#2F4157] rounded-lg hover:bg-[#B3B3B3]">
          GANTI EMAIL PENGIRIMAN
        </button>
      </Link>
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
