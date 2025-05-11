'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="bg-[#2F4157] text-[#F4EFEB] py-[10vw] md:py-[4vw] px-6 md:px-[10vw] lg:px-[14vw] w-full"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start justify-between w-full gap-8 md:gap-6">
        {/* Logo & Description Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-6">
          <Image src="/logokarirtegak.png" alt="Karir.AI Logo" width={120} height={40} className="cursor-pointer" />
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold md:w-full w-[60vw] mx-auto">Karir.ai adalah produk dari proyek senior UGM.</p>
            <p className="mt-2 text-sm text-[#C7D9E5]">Made with ❤️ and ☕ by:</p>
            <ul className="mt-1 text-sm space-y-1 font-sans">
              <li>Muhammad Luthfi Attaqi - 22/496427/TK/54387</li>
              <li>Septian Eka Rahmadi - 22/496732/TK/54442</li>
              <li>Shafa Aura Yogadiasa - 22/496508/TK/54406</li>
            </ul>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col space-y-3 items-center md:items-end w-full md:w-auto font-sans">
          <motion.a whileHover={{ scale: 1.1 }} href="/result" className="hover:text-[#F4EFEB] transition">Analisa Resume</motion.a>
          <motion.a whileHover={{ scale: 1.1 }} href="/jobs" className="hover:text-[#F4EFEB] transition">Lowongan</motion.a>
          <motion.a whileHover={{ scale: 1.1 }} href="/about" className="hover:text-[#F4EFEB] transition">About</motion.a>
        </nav>
      </div>
      
      {/* Copyright Section */}
      <div className="text-center mt-[4vw] text-sm text-[#C7D9E5] w-full">
        © {new Date().getFullYear()} Karir.AI. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
