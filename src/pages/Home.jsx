import { Navbar } from "../components/Navbar";
import LiquidEther from "../components/LiquidEther";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ProjectsModal } from "../components/ProjectsModal";
import { ContactSection } from "../components/ContactSection";
import { TerminalPopup } from "../components/TerminalPopup";
import { useState } from "react";

export const Home = () => {
  const [openWindows, setOpenWindows] = useState({});

  const handleOpenWindow = (windowId) => {
    window.dispatchEvent(new CustomEvent('popupOpen', { detail: windowId }));
    setOpenWindows((prev) => ({
      ...prev,
      [windowId]: true,
    }));
  };

  const handleCloseWindow = (windowId) => {
    // Dispatch close event so the window can play its exit animation.
    // Delay removal from state so the animation has time to finish.
    window.dispatchEvent(new CustomEvent('popupClose', { detail: windowId }));

    // Contact popup handles animation internally, no delay needed
    // Other windows: 500ms for their animations
    const delay = windowId === 'contact' ? 0 : 500;

    setTimeout(() => {
      setOpenWindows((prev) => {
        const updated = { ...prev };
        delete updated[windowId];
        return updated;
      });
    }, delay);
  };

  const windowTitles = {
    about: "About Le Skal",
    projects: "My Projects",
    contact: "Contact",
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

      {/* Navbar - hide when projects or about is open */}
      {!openWindows.projects && !openWindows.about && <Navbar hideLanguageToggle={openWindows.contact} />}
      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {!openWindows.projects && !openWindows.about && <HeroSection onOpenWindow={handleOpenWindow} />}
        {/* Full Page Sections */}
        {openWindows.about && (
          <AboutSection onClose={() => handleCloseWindow("about")} />
        )}
        {/* Popups */}
        {openWindows.projects && (
          <ProjectsModal
            onClose={() => handleCloseWindow("projects")}
          />
        )}
        {openWindows.contact && (
          <TerminalPopup
            title="CONTACT.EXE"
            onClose={() => handleCloseWindow("contact")}
          >
            <ContactSection isPopup />
          </TerminalPopup>
        )}
      </main>
    </div>
  );
};
