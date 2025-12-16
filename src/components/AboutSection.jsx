import { useLanguage } from "@/contexts/LanguageContext";
import { BalatroBackground } from "./BalatroBackground";
import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export const AboutSection = ({ onClose }) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
      setIsClosing(true);
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
      myApproach: "My Approach",
      workingStyle: "Working Style",
      values: "Values",
      futureVision: "Future Vision",
      immediateGoals: "Immediate Goals",
      fiveYearVision: "5-Year Vision",
      tenYearVision: "10-Year Vision",
      beyondWork: "Beyond Work",
      hobbies: "Hobbies",
      inspiration: "Inspiration",
      commitment: "Commitment"
    },
    fr: {
      myStory: "Mon Histoire",
      experience: "Expériences",
      myDNA: "Mon ADN",
      myApproach: "Mon Approche",
      workingStyle: "Style de Travail",
      values: "Valeurs",
      futureVision: "Vision Future",
      immediateGoals: "Objectifs Immédiats",
      fiveYearVision: "Vision 5 Ans",
      tenYearVision: "Vision 10 Ans",
      beyondWork: "Au-Delà du Travail",
      hobbies: "Loisirs",
      inspiration: "Inspiration",
      commitment: "Engagement"
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

  return (
    <section className={`relative w-full min-h-screen bg-black text-white overflow-hidden transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12"}`}>
      {/* Fixed Balatro Background */}
      <div className="fixed inset-0 z-0">
        <BalatroBackground
          pixelFilter={2000}
          spinRotation={-2.0}
          spinSpeed={3.0}
          isRotate={false}
          mouseInteraction={true}
          color1="#050409"   /* very dark base */
          color2="#241331"   /* deep muted purple */
          color3="#3c383cff"   /* toned-down plum accent */
        />
      </div>

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
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-400/30 rounded-full mb-6">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-purple-300 uppercase tracking-wider">
                  {aboutData.profile.about.nationality} • {aboutData.profile.about.location}
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              {aboutData.profile.headline}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl border-l-4 border-purple-500 pl-6 py-2">
              {aboutData.profile.about.background}
            </p>
          </div>

          {/* My Story Section */}
          <div className="mt-16 sm:mt-20 md:mt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-purple-500"></span>
                {t.myStory}
              </h2>

              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm mb-8">
                <p className="text-base sm:text-lg text-purple-200 leading-relaxed italic">
                  {aboutData.mon_histoire.introduction}
                </p>
              </div>

              <div className="space-y-6">
                {aboutData.mon_histoire.chapters.map((chapter, index) => (
                  <div key={index} className="border-l-2 border-purple-500/30 pl-6">
                    <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {chapter.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-400/30 rounded-2xl p-6 sm:p-8">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  {aboutData.mon_histoire.conclusion}
                </p>
              </div>
            </div>
          </div>

          {/* Key Experiences */}
          <div className="mt-16 sm:mt-20 md:mt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-purple-500"></span>
                {t.experience}
              </h2>

              <div className="space-y-6">
                {aboutData.experiences_cles.map((exp, index) => (
                  <div key={index} className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-purple-400/40 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {exp.title}
                      </h3>
                      <span className="text-xs sm:text-sm text-purple-300 font-mono px-3 py-1 bg-purple-500/20 rounded-full w-fit">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-gray-400 mb-5">
                      {exp.description}
                    </p>

                    <div className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-300">
                          <span className="text-purple-400 mt-1">▹</span>
                          <span className="flex-1">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My DNA */}
          <div className="mt-16 sm:mt-20 md:mt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-purple-500"></span>
                {t.myDNA}
              </h2>

              <div className="mb-8 bg-gradient-to-r from-purple-900/40 to-pink-900/30 border-l-4 border-purple-400 rounded-r-xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-200 mb-3">
                  {aboutData.adn.title}
                </h3>
                <p className="text-base sm:text-lg text-white leading-relaxed">
                  {aboutData.adn.ambition}
                </p>
              </div>

              <div className="space-y-5">
                {aboutData.adn.competences.map((comp, index) => (
                  <div key={index}>
                    <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2">
                      {comp.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Approach & Values */}
          <div className="mt-16 sm:mt-20 md:mt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-purple-500"></span>
                {t.myApproach}
              </h2>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-400/30 rounded-xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-3">
                    {t.workingStyle}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.approche_valeurs.working_style}
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-3">
                    {t.values}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.approche_valeurs.values}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Aspirations */}
          <div className="mt-16 sm:mt-20 md:mt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-purple-500"></span>
                {t.futureVision}
              </h2>

              <div className="space-y-6">
                <div className="border-l-2 border-purple-400/40 pl-6">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2">
                    {t.immediateGoals}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.aspirations.immediate}
                  </p>
                </div>

                <div className="border-l-2 border-purple-400/40 pl-6">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2">
                    {t.fiveYearVision}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.aspirations.five_years}
                  </p>
                </div>

                <div className="border-l-2 border-purple-400/40 pl-6">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2">
                    {t.tenYearVision}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.aspirations.ten_years}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Life */}
          <div className="mt-16 sm:mt-20 md:mt-24 pb-12 sm:pb-16 md:pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-purple-500"></span>
                {t.beyondWork}
              </h2>

              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 border border-purple-400/20 rounded-xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-3">
                    {t.hobbies}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.personal.hobbies.join(', ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-3">
                    {t.inspiration}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.personal.inspiration.join(', ')}
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-3">
                    {t.commitment}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {aboutData.personal.engagement}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-16 sm:mt-20 md:mt-24 pb-16">
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
