"use client";

import Image from "next/image";
import Link from "next/link";

export default function PaymentConfirmation() {
  return (
    <div className="flex flex-col min-h-screen">
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

      <main className="bg-[#F8F6F3] flex-grow p-6 md:p-12 flex flex-col items-center">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-[#344054] mb-6">
          LANGKAH KE-2 DARI 3
        </h1>

        {/* Payment Confirmation Box */}
        <div className="bg-[#2F4157] text-white p-8 rounded-lg w-full max-w-2xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex-1 text-sm space-y-2">
            <p>Berikut adalah konfirmasi pemesanan</p>
            <p className="text-blue-300 underline">septianekarahmadi@mail.ugm.ac.id</p>
            <p><strong>Nama:</strong> Septian Eka Rahmadi</p>
            <p><strong>Harapan Lokasi:</strong> Kabupaten Sleman, DIY</p>
            <p><strong>Harapan Pendapatan:</strong> Rp2.000.000 - Rp5.000.000</p>
            <p><strong>File Resume ATS:</strong> <span className="text-blue-300 underline">lihat file</span></p>
            <div className="bg-gray-300 text-gray-800 p-4 rounded mt-4">
              <strong>Total Biaya Layanan</strong>
              <p className="text-lg font-bold">Rp30.000,00</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image src="/qriskarir.png" alt="QRIS Payment" width={180} height={180} className="rounded-md" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <button className="px-6 py-3 bg-[#6B7A90] text-white rounded-lg">CEK STATUS PEMBAYARAN</button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg">BATALKAN PERMINTAAN</button>
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
