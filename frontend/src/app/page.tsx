import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div className={`font-righteous bg-background text-foreground`}>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold font-righteous">Welcome to Karir.AI</h1>
      </div>
      <Footer />
    </div>
  );
}