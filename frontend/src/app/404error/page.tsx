"use client";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F3]">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-[#2F4157] text-center px-4">
        <h1 className="text-4xl font-bold">404 ERROR</h1>
        <p className="text-2xl mt-2">Halaman tidak tersedia</p>
        <button className="mt-6 px-6 py-3 bg-[#476582] text-white rounded-lg hover:bg-[#3a546d]">
          KEMBALI KE HOME
        </button>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
