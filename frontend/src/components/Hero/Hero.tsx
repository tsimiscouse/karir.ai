'use client';
import React from 'react';
import ModelViewer from '../3d/ModelViewer';

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between rounded-lg">
      <div className="md:w-1/2 ">
        <h1 className="text-3xl font-bold mb-4 text-black">TEMUKAN POTENSI, GAPAI POSISI</h1>
        <p className="text-gray-700 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tincidunt orci. 
          Suspendisse semper ipsum eu mi viverra, vitae imperdiet velit maximus. Duis commodo 
          tincidunt sapien, eu consectetur sem. Ut at ullamcorper diam. Vivamus eget porta ex, 
          nec ultrices mi.
        </p>
        <button className="bg-[#577C8E] text-white px-6 py-2 rounded-full hover:bg-[#456a7c] transition-colors">
          COBA SEKARANG
        </button>
      </div>
      <div className="flex justify-center mt-8 md:mt-0">
        <div className="h-[350px] bg-transparent rounded-lg flex items-center justify-center relative">
          <ModelViewer />
        </div>
      </div>
    </section>
  );
};

export default Hero;