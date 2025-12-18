import { Navbar } from "../components/Navbar";
import LiquidEther from "../components/LiquidEther";
import { HeroSection } from "../components/HeroSection";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Home = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    document.title = "Raphael Skal - Data Engineer & Developer";
  }, []);

  const handleOpenWindow = (windowId) => {
    navigate(`/${language}/${windowId}`);
  };

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <Navbar />
      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection onOpenWindow={handleOpenWindow} />
      </main>
    </div>
  );
};
