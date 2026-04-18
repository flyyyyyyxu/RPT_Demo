import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WorkflowSection from "@/components/WorkflowSection";
import ModeCompareSection from "@/components/ModeCompareSection";
import InsightSection from "@/components/InsightSection";
import StrategySection from "@/components/StrategySection";
import ResultSection from "@/components/ResultSection";
import ValueSection from "@/components/ValueSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <WorkflowSection />
        <ModeCompareSection />
        <InsightSection />
        <StrategySection />
        <ResultSection />
        <ValueSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
