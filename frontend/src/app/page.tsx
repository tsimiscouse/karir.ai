"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import OpportunityForm from "@/components/OpportunityForm/OpportunityForm";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large"/>
      </div>
    );
  }

  return (
    <div className={`font-righteous text-foreground bg-white min-h-screen`}>
      <div className="w-full flex-col items-center justify-center">
        <Navbar />
        <div className="w-full flex items-center justify-center px-[10vw] pt-[10vh] md:px-[15vw] md:pt-[10vh] min-h-screen bg-white">
          <Hero />
        </div>
        <div id="opportunity-form" className="w-full pt-0 md:pt-[10vh] flex items-center justify-center min-h-screen bg-white">
          <HowItWorks />
        </div>
        {/* <div className="w-full flex items-center justify-center px-[15vw] pt-[10vh] min-h-screen bg-white">
          <JobListingSection />
        </div> */}
        <div className="w-full flex items-center justify-center pt-0 md:pt-[20vh] pb-0 md:pb-[20vh] min-h-screen bg-white">
          <OpportunityForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}
