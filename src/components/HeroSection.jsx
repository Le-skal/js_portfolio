import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import TextType from "@/components/TextType";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandGithub, IconBrandLinkedin, IconFileText, IconUser, IconBriefcase, IconMail } from "@tabler/icons-react";

export const HeroSection = ({ onOpenWindow }) => {
  const { t, language } = useLanguage();
  const [showHero, setShowHero] = useState(true);

  const dockLinks = [
    {
      title: t("navbar.about"),
      icon: <IconUser className="h-full w-full text-foreground/80" />,
      onClick: () => onOpenWindow("about"),
    },
    {
      title: t("navbar.projects"),
      icon: <IconBriefcase className="h-full w-full text-foreground/80" />,
      onClick: () => onOpenWindow("projects"),
    },
    {
      title: t("navbar.contact"),
      icon: <IconMail className="h-full w-full text-foreground/80" />,
      onClick: () => onOpenWindow("contact"),
    },
    {
      title: t("hero.cv"),
      icon: <IconFileText className="h-full w-full text-foreground/80" />,
      href: language === 'fr' ? 'https://raw.githubusercontent.com/Le-skal/js_portfolio/main/docs/CV_FR.pdf' : 'https://raw.githubusercontent.com/Le-skal/js_portfolio/main/docs/CV_EN.pdf',
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-foreground/80" />,
      href: "https://github.com/Le-skal",
    },
    {
      title: "LinkedIn",
      icon: <IconBrandLinkedin className="h-full w-full text-foreground/80" />,
      href: "https://www.linkedin.com/in/raphael-martin-10a17128a/",
    },
  ];

  // Preload carousel images on mount for faster loading
  useEffect(() => {
    const carouselImages = [
      "/projects_img/project1.png",
      "/projects_img/project2.png",
      "/projects_img/project3.png",
      "/projects_img/project4.png",
      "/projects_img/project5.png"
    ];

    carouselImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Listen for popup opens to hide hero
  useEffect(() => {
    const handlePopupOpen = () => {
      setShowHero(false);
    };

    const handlePopupClose = () => {
      // Small delay to sync with popup close animation
      setTimeout(() => setShowHero(true), 100);
    };

    // We'll trigger these manually from Home.jsx
    window.addEventListener('popupOpen', handlePopupOpen);
    window.addEventListener('popupClose', handlePopupClose);

    return () => {
      window.removeEventListener('popupOpen', handlePopupOpen);
      window.removeEventListener('popupClose', handlePopupClose);
    };
  }, [language, t]);

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12 pt-24 pb-16 select-none"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container max-w-6xl mx-auto text-center z-10">
          {showHero && (
            <div className="space-y-16 animate-text-fade">
              {/* Main heading with enhanced layout */}
              <div className="space-y-8">
                <div className="relative">
                  <h1 className="font-medieval text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none">
                    <span className="text-transparent bg-clip-text inline-block"
                      style={{
                        backgroundImage: 'linear-gradient(90deg, #a78bfa, #c084fc, #f0abfc, #c084fc, #a78bfa)',
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 8s ease-in-out infinite'
                      }}>
                      {t("hero.name")} {t("hero.lastname")}
                    </span>
                  </h1>
                  {/* Subtle underline effect */}
                  <div className="h-1 w-32 sm:w-40 md:w-48 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400
                                mx-auto mt-6 rounded-full opacity-60 animate-pulse-subtle" />
                </div>
              </div>

              {/* Description with better spacing */}
              <div className="max-w-3xl mx-auto">
                <p className="text-[#b0bec5] text-xl md:text-2xl italic tracking-wide"
                   style={{ textShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 8px' }}>
                  {t("hero.description")}
                </p>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Floating Dock - always visible */}
      <FloatingDock items={dockLinks} />
    </>
  );
};
