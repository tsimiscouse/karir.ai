'use client';
import React from 'react';
import Image from 'next/image';
import Feature from './Feature';

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between rounded-lg">
      <div className="md:w-1/2 ">
        <h1 className="text-3xl font-bold mb-4 mx-2 text-black">TEMUKAN POTENSI, GAPAI POSISI</h1>
        <p className="text-gray-700 text-justify mb-6 mx-2">
        Apakah Anda siap untuk mengambil langkah selanjutnya dalam karier Anda? Dengan teknologi AI mutakhir kami, Anda dapat mengoptimalkan peluang kerja Anda dengan mudah! Cukup unggah resume Anda, dan biarkan sistem kami menganalisis keterampilan, pengalaman, dan keahlian Anda.
        </p>

        <Feature></Feature>
      </div>
      <div className="flex justify-center mt-8 md:mt-0">
        <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center relative">
          <Image
            src="/api/placeholder/500/500"
            alt="Karir.AI Hero Image"
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;