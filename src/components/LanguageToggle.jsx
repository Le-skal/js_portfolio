import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", label: "EN", fullName: "English", flag: "🇭🇰" },
  { code: "fr", label: "FR", fullName: "Français", flag: "🇫🇷" },
];

const perspective = {
  initial: {
    opacity: 0,
    rotateX: 90,
    translateY: 80,
    translateX: -20,
  },
  enter: (i) => ({
    opacity: 1,
    rotateX: 0,
    translateY: 0,
    translateX: 0,
    transition: {
      duration: 0.65,
      delay: 0.5 + (i * 0.1),
      ease: [.215, .61, .355, 1],
      opacity: { duration: 0.35 }
    }
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] }
  }
};

const menuContainer = {
  open: {
    width: "240px",
    height: "200px",
    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] }
  },
  closed: {
    width: "100px",
    height: "48px",
    transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] }
  }
};

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const currentLang = languages.find((lang) => lang.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div
        className="relative"
        variants={menuContainer}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        style={{
          borderRadius: '0.75rem',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Animated gradient orbs - only visible when open */}
        {isOpen && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/6 right-1/6 w-24 h-24 bg-violet-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-purple-500/15 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-2/3 right-1/3 w-28 h-28 bg-gradient-to-r from-violet-500/10 to-pink-500/15 rounded-full blur-3xl" />
          </div>
        )}

        {/* Language Panel - appears when open */}
        <AnimatePresence>
          {isOpen && (
            <div className="relative h-full p-2" style={{ perspective: 1200 }}>
              <div className="space-y-2 mt-12 pb-2">
                {languages.map((lang, index) => {
                  const isActive = language === lang.code;
                  return (
                    <motion.button
                      key={lang.code}
                      custom={index}
                      variants={perspective}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                 text-left transition-colors duration-200 group/item relative
                                 ${isActive
                          ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300"
                          : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                        }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{lang.fullName}</div>
                        <div className={`text-xs ${isActive ? 'text-violet-400' : 'text-foreground/40'}`}>
                          {lang.label}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Toggle Button - always visible */}
        <div className="absolute top-0 left-0 w-full h-12 flex items-center px-4 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 hover:scale-105 transition-transform"
            aria-label="Change language"
          >
            <Languages className="w-5 h-5 text-foreground/80 group-hover:text-violet-400 transition-colors" />
            {!isOpen && (
              <span className="text-sm font-bold uppercase tracking-widest text-foreground/80">
                {currentLang?.label}
              </span>
            )}
            {isOpen && (
              <span className="text-sm font-medium text-foreground/60">
                Close
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
