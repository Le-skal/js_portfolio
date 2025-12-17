import { useLanguage } from "@/contexts/LanguageContext";
import { X, HeartHandshake } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import MagicBento from "./MagicBento";

export const AboutSection = ({ onClose }) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [aboutData, setAboutData] = useState(null);
  const contentRef = useRef(null);

  // Load about JSON from public folder
  useEffect(() => {
    const loadAbout = async () => {
      try {
        const jsonFile = language === 'fr' ? '/about_json/about_fr.json' : '/about_json/about_en.json';
        const response = await fetch(jsonFile);
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error('Error loading about data:', error);
      }
    };
    loadAbout();
  }, [language]);

  // Trigger entrance animation on mount and listen for global popupClose events
  useEffect(() => {
    // Defer to next frame so CSS transition can run
    const raf = requestAnimationFrame(() => setIsVisible(true));

    const handlePopupClose = (e) => {
      // Start exit animation; parent will remove the component shortly after
      setIsVisible(false);
    };

    window.addEventListener("popupClose", handlePopupClose);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("popupClose", handlePopupClose);
    };
  }, []);

  // Section titles translation
  const sectionTitles = {
    en: {
      myStory: "My Story",
      experience: "Experience",
      myDNA: "My DNA",
      approachValues: "Approach & Values",
      futureVision: "Future Vision",
      immediateGoals: "Immediate Goals",
      fiveYearVision: "5-Year Vision",
      tenYearVision: "10-Year Vision",
      beyondWork: "Beyond Work",
      hobbies: "Hobbies",
      inspiration: "Inspiration",
      jumpTo: "Jump to",
      readMore: "Read more",
      showLess: "Show less",
      workingStyle: "Working Style",
      values: "Values"
    },
    fr: {
      myStory: "Mon Histoire",
      experience: "Expériences",
      myDNA: "Mon ADN",
      approachValues: "Approche & Valeurs",
      futureVision: "Vision Future",
      immediateGoals: "Objectifs Immédiats",
      fiveYearVision: "Vision 5 Ans",
      tenYearVision: "Vision 10 Ans",
      beyondWork: "Au-Delà du Travail",
      hobbies: "Loisirs",
      inspiration: "Inspiration",
      jumpTo: "Aller à",
      readMore: "Lire la suite",
      showLess: "Réduire",
      workingStyle: "Style de travail",
      values: "Valeurs"
    }
  };

  const t = sectionTitles[language] || sectionTitles.en;

  // Show loading if about data hasn't loaded yet
  if (!aboutData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Story Chapter Cards
  const storyCards = aboutData.mon_histoire.chapters.map((chapter, index) => ({
    color: '#060010',
    title: chapter.title,
    description: chapter.content,
    label: `Chapter ${index + 1}`
  }));

  // Experience Cards with all achievements
  const experienceCards = aboutData.experiences_cles.map(exp => ({
    color: '#060010',
    title: exp.title,
    description: exp.description + '\n\n' + exp.achievements.map(a => `• ${a}`).join('\n'),
    label: exp.period
  }));

  // DNA Competence Cards
  const dnaCards = aboutData.adn.competences.map(comp => ({
    color: '#060010',
    title: comp.name,
    description: comp.description,
    label: 'DNA'
  }));

  // Aspirations Cards
  const aspirationsCards = [
    {
      color: '#060010',
      title: t.immediateGoals,
      description: aboutData.aspirations.immediate,
      label: 'Now'
    },
    {
      color: '#060010',
      title: t.fiveYearVision,
      description: aboutData.aspirations.five_years,
      label: '5 Years'
    },
    {
      color: '#060010',
      title: t.tenYearVision,
      description: aboutData.aspirations.ten_years,
      label: '10 Years'
    }
  ];

  // Personal Cards
  const personalCards = [
    {
      color: '#060010',
      title: t.hobbies,
      description: aboutData.personal.hobbies.join(' • '),
      label: 'Hobbies'
    },
    {
      color: '#060010',
      title: t.inspiration,
      description: aboutData.personal.inspiration.join(' • '),
      label: 'Inspiration'
    }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-4 mb-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-purple-200 tracking-tight">
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-purple-500/40 to-transparent" />
    </div>
  );

  const StoryTimeline = ({ chapters }) => {
    const [expanded, setExpanded] = useState(() => new Set());

    const toggle = (index) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    };

    const getExcerpt = (text) => {
      const trimmed = (text || "").trim();
      if (trimmed.length <= 240) return trimmed;
      return `${trimmed.slice(0, 240)}…`;
    };

    return (
      <ol className="relative border-l border-purple-400/30 pl-6 space-y-6">
        {chapters.map((chapter, index) => {
          const isExpanded = expanded.has(index);

          return (
            <li key={index} className="relative">
              <span className="absolute -left-[9px] top-4 block h-4 w-4 rounded-full bg-purple-500 border-2 border-[#060010] shadow-lg shadow-purple-500/40" />
              <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4 sm:p-5 hover:bg-purple-500/15 transition-colors duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-200">
                        {index + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-purple-200">{chapter.title}</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="text-sm text-purple-300 hover:text-purple-200 transition-colors underline decoration-purple-400/40 hover:decoration-purple-300/70"
                  >
                    {isExpanded ? t.showLess : t.readMore}
                  </button>
                </div>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {isExpanded ? chapter.content : getExcerpt(chapter.content)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <section className={`relative w-full min-h-screen text-white overflow-hidden transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12"}`} style={{ backgroundColor: '#060010' }}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={28} className="text-gray-300 hover:text-white transition-colors" />
        </button>
      )}

      {/* Scrollable Content - No Scrollbar */}
      <div ref={contentRef} className="relative z-10 w-full h-screen overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full py-8 sm:py-10 md:py-12">

          {/* Hero Section */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 md:pt-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-[#060010] border border-purple-400/30 rounded-lg p-6 sm:p-8 hover:border-purple-400/50 transition-all duration-300">
                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
                  {aboutData.profile.about.background}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-purple-500/5 to-purple-500/10 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                    <span className="text-sm font-semibold text-purple-200 tracking-wide uppercase">{t.jumpTo}</span>
                  </div>
                  <div className="h-px flex-1 ml-4 bg-gradient-to-r from-purple-400/30 to-transparent"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-story')}
                    className="group/btn relative px-3 py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 overflow-hidden"
                  >
                    <span className="relative z-10">{t.myStory}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-experience')}
                    className="group/btn relative px-3 py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 overflow-hidden"
                  >
                    <span className="relative z-10">{t.experience}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-dna')}
                    className="group/btn relative px-3 py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 overflow-hidden"
                  >
                    <span className="relative z-10">{t.myDNA}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-approach')}
                    className="group/btn relative px-3 py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 overflow-hidden"
                  >
                    <span className="relative z-10">{t.approachValues}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-vision')}
                    className="group/btn relative px-3 py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 overflow-hidden"
                  >
                    <span className="relative z-10">{t.futureVision}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('about-personal')}
                    className="group/btn relative px-3 py-2.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 overflow-hidden"
                  >
                    <span className="relative z-10">{t.beyondWork}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content (no trays/accordions) */}
          <div className="mt-10 sm:mt-12 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

            <div className="space-y-10 sm:space-y-12">
              <div id="about-story">
                <SectionHeader title={t.myStory} />
                <StoryTimeline chapters={aboutData.mon_histoire.chapters} />
              </div>

              <div id="about-experience">
                <SectionHeader title={t.experience} />
                <MagicBento
                  cardData={experienceCards}
                  textAutoHide={false}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect={true}
                  spotlightRadius={280}
                  particleCount={10}
                  glowColor="132, 0, 255"
                />
              </div>

              <div id="about-dna">
                <SectionHeader title={t.myDNA} />
                <MagicBento
                  cardData={dnaCards}
                  textAutoHide={false}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect={true}
                  spotlightRadius={280}
                  particleCount={10}
                  glowColor="132, 0, 255"
                />
              </div>

              <div id="about-approach">
                <SectionHeader title={t.approachValues} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-5 hover:bg-purple-500/15 transition-colors duration-200">
                    <div className="flex items-center gap-2 text-purple-300">
                      <HeartHandshake className="w-4 h-4" />
                      <span className="text-sm font-medium">{t.workingStyle}</span>
                    </div>
                    <p className="mt-2 text-gray-200 leading-relaxed">
                      {aboutData.approche_valeurs.working_style}
                    </p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-5 hover:bg-purple-500/15 transition-colors duration-200">
                    <div className="flex items-center gap-2 text-purple-300">
                      <HeartHandshake className="w-4 h-4" />
                      <span className="text-sm font-medium">{t.values}</span>
                    </div>
                    <p className="mt-2 text-gray-200 leading-relaxed">
                      {aboutData.approche_valeurs.values}
                    </p>
                  </div>
                </div>
              </div>

              <div id="about-vision">
                <SectionHeader title={t.futureVision} />
                <MagicBento
                  cardData={aspirationsCards}
                  textAutoHide={false}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect={true}
                  spotlightRadius={280}
                  particleCount={10}
                  glowColor="132, 0, 255"
                />
              </div>

              <div id="about-personal">
                <SectionHeader title={t.beyondWork} />
                <MagicBento
                  cardData={personalCards}
                  textAutoHide={false}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect={true}
                  spotlightRadius={280}
                  particleCount={10}
                  glowColor="132, 0, 255"
                />
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-1 sm:mt-2 md:mt-3 pb-3">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-right">
              <p className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-purple-400/80" style={{ fontFamily: "'Taken by Vultures', cursive" }}>
                Skal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
