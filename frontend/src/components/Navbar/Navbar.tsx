'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="fixed w-full bg-[#F4EFEB] shadow-md z-50 font-sans"
    >
      <div className="flex justify-between items-center mx-[10vw] md:ml-[12vw] md:mr-[12vw] md:px-10 md:py-[1.5vw] py-8">
        <Link href="/">
          <Image src="/logokarirmiring.png" alt="Karir.AI Logo" width={120} height={40} className="cursor-pointer" />
        </Link>
        <div className="hidden md:flex space-x-[4vw] font-medium text-[1vw] text-gray-700">
          <Link href="/" className="hover-underline transition">Home</Link>
          <Link href="/result" className="hover-underline transition">Analisa Resume</Link>
          <Link href="/jobs" className="hover-underline transition">Lowongan</Link>
          <Link href="/about" className="hover-underline transition">About</Link>
        </div>
        <button 
          className="md:hidden focus:outline-none text-[#2F4157]" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          transition={{ duration: 0.3 }}
          className="md:hidden flex flex-col items-center space-y-4 py-4 bg-[#F4EFEB] shadow-md"
        >
          <Link href="/result" className="text-lg font-medium text-gray-700 hover-underline transition">Analisa Resume</Link>
          <Link href="/jobs" className="text-lg font-medium text-gray-700 hover-underline transition">Lowongan</Link>
          <Link href="/about" className="text-lg font-medium text-gray-700 hover-underline transition">About</Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
