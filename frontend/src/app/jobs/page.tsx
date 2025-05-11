"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import JobListingSection from "@/components/Job/JobListingSection";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function JobsPage() {
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
      <Navbar />
      <div className="w-full flex-grow pt-[12vh] pb-[5vh] md:pt-[18vh] md:pb-[10vh]">
        <div className="w-full flex items-center justify-center px-0 md:px-[15vw] min-h-screen bg-white">
          <JobListingSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
