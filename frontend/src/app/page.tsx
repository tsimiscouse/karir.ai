import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import OpportunityForm from "@/components/OpportunityForm/OpportunityForm";
import JobListingSection from "@/components/Job/JobListingSection";
import HowItWorks from "@/components/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <div className={`font-righteous text-foreground bg-white min-h-screen`}>
      <Navbar />
      <div className="w-full flex-grow">
        <div className="w-full flex items-center justify-center px-[15vw] pt-[10vh] min-h-screen bg-white">
          <Hero />
        </div>
        <div id="opportunity-form" className="w-full flex items-center justify-center min-h-screen bg-white">
          <OpportunityForm />
        </div>
        <div className="w-full flex items-center justify-center px-[15vw] min-h-screen bg-white">
          <JobListingSection />
        </div>
        <div className="w-full flex items-center justify-center min-h-screen bg-white">
          <HowItWorks />
        </div>
      </div>
      <Footer />
    </div>
  );
}
