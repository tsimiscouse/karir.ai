import React from 'react';
import Image from 'next/image';

const Feature = () => {
  const cardsData = [
    {
      title: "Rekomendasi Dipersonalisasi",
      description: "Dapatkan saran pekerjaan yang sesuai dengan profil Anda, sehingga Anda dapat fokus pada peluang yang benar-benar relevan.",
      imageUrl: "https://images.unsplash.com/photo-1725610588086-b9e38da987f7?q=80&w=1200",
      altText: "Rekomendasi Dipersonalisasi",
      actionName: "Coba Sekarang!",
      action: "Analisis"
    },
    {
      title: "Daftar Lowongan Terkini",
      description: "Temukan lowongan pekerjaan terbaru yang sesuai dengan minat dan kualifikasi Anda, semua dalam satu tempat.",
      imageUrl: "https://images.unsplash.com/photo-1725610588086-b9e38da987f7?q=80&w=1200",
      altText: "Daftar Lowongan Terkini",
      actionName: "Ayo Lihat",
      action: "Lowongan"
    }
  ];

  const Card = ({ title, description, imageUrl, altText, actionName, action }) => (
    <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 min-h-[400px]">
      <div className="p-4">
        <h6 className="mb-2 text-slate-800 text-xl font-semibold">{title}</h6>
        <p className="text-slate-600 leading-normal text-justify font-light">{description}</p>
      </div>
      <div className="relative h-56 m-4 overflow-hidden text-white rounded-md">
        <Image src={imageUrl}   width={1280} 
  height={720}  alt={altText} className="object-cover w-full h-full" />
      </div>
      <div className="mt-auto">
        <a href={action} className="text-slate-800 font-semibold text-sm hover:underline mx-5 mb-5 flex items-center">
          <p>{actionName}</p>
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row -gap-20 md:gap-5 -mt-5">
      {cardsData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
  
};

export default Feature;