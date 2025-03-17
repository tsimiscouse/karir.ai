import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import OpportunityForm from "@/components/OpportunityForm/OpportunityForm";
import JobListingSection from "@/components/Job/JobListingSection";
import HowItWorks from "@/components/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <div className={`font-righteous bg-background text-foreground`}>
      <Navbar />
      <div className="container mx-auto flex-grow">
        <div className="flex items-center justify-center px-[15vw] pt-[5vw] h-screen bg-white">
          <Hero />
        </div>
        <div className="flex items-center justify-center h-screen bg-[#F4EFEB]">
          <OpportunityForm />
        </div>
        <div className="flex items-center justify-center bg-white">
          <JobListingSection />
        </div>
        <div className="flex items-center justify-center bg-[#F4EFEB]">
          <HowItWorks />
        </div>
      </div>
      <Footer />
    </div>
  );
}
