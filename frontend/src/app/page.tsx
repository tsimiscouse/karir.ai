"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500); // Mulai hilang setelah 2.5 detik

    const redirectTimer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000); // Pindah ke dashboard setelah 3 detik

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center justify-center min-h-screen bg-gray-600 px-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <Image
              src="/logokarirmiring.png"
              alt="Karir.AI Logo"
              width={150}
              height={150}
              className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64"
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#233952] mt-4"
            >
              {/* KARIR.AI */}
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
