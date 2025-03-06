"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-600 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src="/logokarirmiring.png"
            alt="Karir.AI Logo"
            width={150}
            height={150}
            className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#233952] mt-4"
        >
          {/* KARIR.AI */}
        </motion.h1>
      </motion.div>
    </div>
  );
}
