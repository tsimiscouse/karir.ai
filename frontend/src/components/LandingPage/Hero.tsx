"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      {/* Logo */}
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
    </motion.div>
  );
}
