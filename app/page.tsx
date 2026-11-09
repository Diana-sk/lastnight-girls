import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import DressCodeSection from "@/components/DressCodeSection";
import WhatAwaitsSection from "@/components/WhatAwaitsSection";
import InfoSection from "@/components/InfoSection";
import RegistrationSection from "@/components/RegistrationSection";
import FAQSection from "@/components/FAQSection";
import FinalSection from "@/components/FinalSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090708] text-[#FAF7F2]">
      <Navbar />
      <HeroSection />
      <ConceptSection />
      <DressCodeSection />
      <WhatAwaitsSection />
      <InfoSection />
      <RegistrationSection />
      <FAQSection />
      <FinalSection />
      <Footer />
    </main>
  );
}
