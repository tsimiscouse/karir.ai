import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import OpportunityForm from "@/components/OpportunityForm/OpportunityForm";
import JobListingSection from "@/components/Job/JobListingSection";
import HowItWorks from "@/components/HowItWorks/HowItWorks";

export default function Home() {
  return (
    <div className="font-righteous bg-background text-foreground">
      <Navbar />
      <div className="mx-auto flex-grow">
        <div id="Hero" className="flex items-center justify-center px-[15vw] pt-[5vw] w-screen h-screen bg-white">
          <Hero />
        </div>
        <div id="opportunity-form" className="flex items-center justify-center w-screen h-screen bg-[#F4EFEB]">
          <OpportunityForm />
        </div>
        <div id="job-listing" className="flex items-center justify-center w-screen h-screen bg-white">
          <JobListingSection />
        </div>
        <div id="how-it-works" className="flex items-center justify-center w-screen h-screen bg-[#F4EFEB]">
          <HowItWorks />
        </div>
      </div>
      <Footer />
    </div>
  );
}
