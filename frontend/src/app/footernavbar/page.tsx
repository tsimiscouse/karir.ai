import React from "react";
import Image from "next/image";
import Link from "next/link";

const NavbarFooterPage: React.FC = () => {
  return (
    <div className="bg-[#F5F1EE] text-[#2E2E2E] font-poppins min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
              <div className="flex items-center space-x-2">
                <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} />
        </div>
        <div className="flex space-x-8 font-medium text-lg">
          <Link href="#" className="hover:underline">Analisa Resume</Link>
          <Link href="#" className="hover:underline">Lowongan</Link>
          <Link href="#" className="hover:underline">About</Link>
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-[#2F4157] text-[#F4EFEB] py-6 px-10 flex justify-between items-center">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <img src="/logo.png" alt="Karir.ai logo" width="50" height="50" className="mr-2" />
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

export default NavbarFooterPage;