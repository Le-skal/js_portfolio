import { X, ExternalLink, Github } from "lucide-react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import JsBackground from "./JsBackground";
import { CustomCloseButton } from "./CustomCloseButton";
import { useLanguage } from "@/contexts/LanguageContext";

// Helper function to convert JSON projects to carousel format
const convertJsonToProjects = (jsonData) => {
  const projectKeys = ["Scraping-boulanger", "TripHackathon", "ABDD"];
  const imageMap = {
    "Scraping-boulanger": "/projects_img/project1.png",
    "TripHackathon": "/projects_img/project2.png",
    "ABDD": "/projects_img/project3.png"
  };

  return projectKeys.map((key, index) => {
    const project = jsonData.projects[key];
    return {
      id: index + 1,
      key: key,
      title: project.title,
      description: project.description,
      image: imageMap[key],
      tags: project.techStack ? [
        ...Object.values(project.techStack.frontend || "").filter(Boolean),
        ...Object.values(project.techStack.backend || "").filter(Boolean),
        ...(project.techStack.tools ? project.techStack.tools.split(", ").slice(0, 2) : [])
      ].filter(Boolean).slice(0, 3) : [],
      demoUrl: project.metadata.liveUrl || "#",
      githubUrl: project.metadata.githubUrl || "#",
      client: project.metadata.role || "",
      fullData: project // Store full project data for detail view
    };
  });
};

// ProjectDetail component
const ProjectDetail = ({ project, onBack, onClose, scrollToBottom }) => {
  const { t } = useLanguage();
  const detailRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showScrollGlow, setShowScrollGlow] = useState(false);
  // Ensure smooth entrance transition on mount
  const [isEntering, setIsEntering] = useState(true);

  React.useEffect(() => {
    // Use rAF to ensure the initial styles apply before transitioning
    const id = requestAnimationFrame(() => setIsEntering(false));
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll to bottom on mount if requested
  React.useEffect(() => {
    if (scrollToBottom && contentRef.current) {
      // Scroll to bottom when returning from carousel
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    } else if (contentRef.current && !scrollToBottom) {
      // Scroll to top when opening a project detail normally
      contentRef.current.scrollTop = 0;
    }
  }, [scrollToBottom, contentRef]);

  const handleScroll = () => {
    if (!contentRef.current || !scrollIndicatorRef.current) return;

    const element = contentRef.current;
    const indicator = scrollIndicatorRef.current;

    // Get the position of the scroll indicator relative to the viewport
    const indicatorRect = indicator.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if we're actually scrolled down (not at top)
    const isScrolledDown = element.scrollTop > 50;

    // Show glow effect when indicator is close to triggering
    const distanceFromTop = indicatorRect.top;
    const triggerDistance = viewportHeight * 0.3;
    const glowStart = viewportHeight * 0.5;

    if (isScrolledDown && distanceFromTop < glowStart && distanceFromTop > 0) {
      setShowScrollGlow(true);
    } else {
      setShowScrollGlow(false);
    }

    // If indicator reaches top 30% of viewport AND we've scrolled down, trigger return
    if (isScrolledDown && distanceFromTop < triggerDistance) {
      handleBackClick();
    }
  };

  const handleBackClick = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onBack();
    }, 300);
  };

  return (
    <div
      ref={detailRef}
      className={`fixed inset-0 bg-black text-white overflow-hidden flex flex-col transition-all duration-300 ${isLeaving ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      style={isLeaving ? { animation: "detail-page-blur-out 0.8s ease-in forwards" } : {}}
    >
      {/* Background grain/shards behind images for dark-mode feel */}
      <JsBackground tint intensity={0.1} />

      {/* Scrollable Content */}
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{
          transform: isEntering ? "translateY(100px)" : "translateY(0)",
          opacity: isEntering ? 0 : 1,
          filter: isEntering ? "blur(15px)" : "blur(0)",
          transition:
            "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out, filter 0.8s ease-out",
          willChange: "transform, opacity, filter",
        }}
      >
        {/* Hero Section */}
        <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 md:mb-8 tracking-tight">{project.title}</h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-8 sm:mb-12 md:mb-16 text-white/90">
            {project.description}
          </p>

          {/* Project Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-sm mb-8 sm:mb-12 md:mb-16 pb-6 sm:pb-8 border-b border-white/10">
            <div>
              <h4 className="text-white/50 uppercase tracking-wider text-xs font-medium mb-2">{t("projectDetail.category")}</h4>
              <p className="text-white/80">{project.fullData?.metadata?.category || project.client}</p>
            </div>
            <div>
              <h4 className="text-white/50 uppercase tracking-wider text-xs font-medium mb-2">{t("projectDetail.role")}</h4>
              <p className="text-white/80">{project.fullData?.metadata?.role || project.tags.join(", ")}</p>
            </div>
            <div>
              <h4 className="text-white/50 uppercase tracking-wider text-xs font-medium mb-2">{t("projectDetail.timeline")}</h4>
              <p className="text-white/80">{project.fullData?.metadata?.timeline || "2024"}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:col-span-2 lg:col-span-1">
              {project.fullData?.metadata?.liveUrl && project.fullData.metadata.liveUrl !== "null" && (
                <a
                  href={project.fullData.metadata.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-white/20 text-white hover:bg-white/5 transition-colors text-xs uppercase tracking-wider font-medium text-center"
                >
                  {t("projectDetail.liveSite")} →
                </a>
              )}
              {project.fullData?.metadata?.githubUrl && (
                <a
                  href={project.fullData.metadata.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-white/20 text-white hover:bg-white/5 transition-colors text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                >
                  <Github size={14} />
                  {t("projectDetail.github")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="px-4 sm:px-6 md:px-12 max-w-6xl mx-auto py-6 sm:py-8 md:py-12">
          <div className="space-y-6 sm:space-y-8">
            {/* Main project image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Project Details */}
            <div className="py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 md:space-y-12">
              {/* Overview */}
              {project.fullData?.overview && (
                <div>
                  <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3 sm:mb-4 md:mb-6">{t("projectDetail.overview")}</h3>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">{project.fullData.overview}</p>
                </div>
              )}

              {/* Challenge */}
              {project.fullData?.challenge && (
                <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 md:mb-6">{t("projectDetail.challenge")}</h3>
                  <div className="space-y-3 sm:space-y-4 text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">
                    {project.fullData.challenge.problem && <p><strong className="text-white/90">{t("projectDetail.problem")}:</strong> {project.fullData.challenge.problem}</p>}
                    {project.fullData.challenge.goal && <p><strong className="text-white/90">{t("projectDetail.goal")}:</strong> {project.fullData.challenge.goal}</p>}
                    {project.fullData.challenge.constraints && <p><strong className="text-white/90">{t("projectDetail.constraints")}:</strong> {project.fullData.challenge.constraints}</p>}
                  </div>
                </div>
              )}

              {/* Discovery */}
              {project.fullData?.discovery && (
                <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 md:mb-6">Discovery</h3>
                  <div className="space-y-3 sm:space-y-4 text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">
                    {project.fullData.discovery.requirements && <p><strong className="text-white/90">Requirements:</strong> {project.fullData.discovery.requirements}</p>}
                    {project.fullData.discovery.competitiveAnalysis && <p><strong className="text-white/90">Competitive Analysis:</strong> {project.fullData.discovery.competitiveAnalysis}</p>}
                    {project.fullData.discovery.technicalResearch && <p><strong className="text-white/90">Technical Research:</strong> {project.fullData.discovery.technicalResearch}</p>}
                  </div>
                </div>
              )}

              {/* Architecture */}
              {project.fullData?.architecture && (
                <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 md:mb-6">Architecture</h3>
                  <div className="space-y-3 sm:space-y-4 text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">
                    {project.fullData.architecture.informationArchitecture && <p><strong className="text-white/90">Information Architecture:</strong> {project.fullData.architecture.informationArchitecture}</p>}
                    {project.fullData.architecture.technicalDecisions && <p><strong className="text-white/90">Technical Decisions:</strong> {project.fullData.architecture.technicalDecisions}</p>}
                  </div>
                </div>
              )}

              {/* Development Process */}
              {project.fullData?.developmentProcess && (
                <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 md:mb-6">{t("projectDetail.developmentProcess")}</h3>
                  <div className="space-y-3 sm:space-y-4 text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">
                    {project.fullData.developmentProcess.phase1 && <p><strong className="text-white/90">Phase 1:</strong> {project.fullData.developmentProcess.phase1}</p>}
                    {project.fullData.developmentProcess.phase2 && <p><strong className="text-white/90">Phase 2:</strong> {project.fullData.developmentProcess.phase2}</p>}
                    {project.fullData.developmentProcess.phase3 && <p><strong className="text-white/90">Phase 3:</strong> {project.fullData.developmentProcess.phase3}</p>}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {project.fullData?.keyFeatures && project.fullData.keyFeatures.length > 0 && (
                <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 md:mb-6">{t("projectDetail.keyFeatures")}</h3>
                  <div className="space-y-4 sm:space-y-6">
                    {project.fullData.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">
                        {feature.title && <p className="font-semibold text-white/90 mb-2">{feature.title}</p>}
                        {feature.description && <p>{feature.description}</p>}
                        {feature.implementation && <p className="mt-2"><strong className="text-white/90">Implementation:</strong> {feature.implementation}</p>}
                        {feature.challenges && <p className="mt-2"><strong className="text-white/90">Challenges:</strong> {feature.challenges}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testing */}
              {project.fullData?.testing && (
                <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 md:mb-6">Testing</h3>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">{project.fullData.testing}</p>
                </div>
              )}

              {/* Tech Stack */}
              {project.fullData?.techStack && (
                <div className="py-4 sm:py-6 md:py-8 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 md:mb-6">{t("projectDetail.techStack")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {project.fullData.techStack.frontend && project.fullData.techStack.frontend !== "" && (
                      <div>
                        <h4 className="text-white/50 uppercase tracking-wider text-xs font-medium mb-2 sm:mb-3">{t("projectDetail.frontend")}</h4>
                        <p className="text-white/80 text-sm sm:text-base">{project.fullData.techStack.frontend}</p>
                      </div>
                    )}
                    {project.fullData.techStack.backend && project.fullData.techStack.backend !== "" && (
                      <div>
                        <h4 className="text-white/50 uppercase tracking-wider text-xs font-medium mb-2 sm:mb-3">{t("projectDetail.backend")}</h4>
                        <p className="text-white/80 text-sm sm:text-base">{project.fullData.techStack.backend}</p>
                      </div>
                    )}
                    {project.fullData.techStack.tools && (
                      <div>
                        <h4 className="text-white/50 uppercase tracking-wider text-xs font-medium mb-2 sm:mb-3">{t("projectDetail.tools")}</h4>
                        <p className="text-white/80 text-sm sm:text-base">{project.fullData.techStack.tools}</p>
                      </div>
                    )}
                    {project.fullData.techStack.libraries && (
                      <div>
                        <h4 className="text-white/50 uppercase tracking-wider text-xs font-medium mb-2 sm:mb-3">{t("projectDetail.libraries")}</h4>
                        <p className="text-white/80 text-sm sm:text-base">{project.fullData.techStack.libraries}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Results Section */}
              {project.fullData?.results && (
                <div className="py-6 sm:py-8 md:py-12 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 md:mb-8">{t("projectDetail.results")}</h3>
                  <div className="space-y-4 sm:space-y-6 text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">
                    {project.fullData.results.technicalAchievements && (
                      <p><strong className="text-white/90">{t("projectDetail.technicalAchievements")}:</strong> {project.fullData.results.technicalAchievements}</p>
                    )}
                    {project.fullData.results.businessImpact && (
                      <p><strong className="text-white/90">{t("projectDetail.businessImpact")}:</strong> {project.fullData.results.businessImpact}</p>
                    )}
                    {project.fullData.results.personalGrowth && (
                      <p><strong className="text-white/90">{t("projectDetail.personalGrowth")}:</strong> {project.fullData.results.personalGrowth}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Key Learnings */}
              {project.fullData?.learnings && project.fullData.learnings.length > 0 && (
                <div className="py-6 sm:py-8 md:py-12 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 md:mb-8">{t("projectDetail.keyLearnings")}</h3>
                  <ul className="space-y-3 sm:space-y-4 text-white/70 leading-relaxed text-sm sm:text-base md:text-lg list-disc list-inside">
                    {project.fullData.learnings.map((learning, idx) => (
                      <li key={idx}>{learning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Future Enhancements */}
              {project.fullData?.futureEnhancements && project.fullData.futureEnhancements.length > 0 && (
                <div className="py-6 sm:py-8 md:py-12 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 md:mb-8">{t("projectDetail.futureEnhancements")}</h3>
                  <ul className="space-y-3 sm:space-y-4 text-white/70 leading-relaxed text-sm sm:text-base md:text-lg list-disc list-inside">
                    {project.fullData.futureEnhancements.map((enhancement, idx) => (
                      <li key={idx}>{enhancement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conclusion */}
              {project.fullData?.conclusion && (
                <div className="py-6 sm:py-8 md:py-12 border-t border-white/10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4 sm:mb-6 md:mb-8">{t("projectDetail.conclusion")}</h3>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base md:text-lg">{project.fullData.conclusion}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 sm:px-6 md:px-12 max-w-6xl mx-auto py-8 sm:py-12 md:py-16 pb-12 sm:pb-16 md:pb-24 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
              <span className="text-xs uppercase tracking-wider text-white/30 whitespace-nowrap">Scroll for menu</span>
              <div
                ref={scrollIndicatorRef}
                className="flex-1 h-px bg-white/10 transition-all duration-300"
                style={showScrollGlow ? {
                  animation: "scroll-indicator-glow 1.5s ease-in-out infinite",
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 0 20px 8px rgba(255, 255, 255, 0.2)"
                } : {}}
              ></div>
            </div>
            <a
              href={project.githubUrl}
              className="px-6 sm:px-8 py-2 sm:py-3 border border-white/20 text-white hover:bg-white/5 transition-colors text-xs uppercase tracking-wider font-medium sm:ml-8 w-full sm:w-auto text-center"
            >
              GitHub →
            </a>
          </div>
        </div>

        {/* Extra blank space at the end */}
        <div className="h-150"></div>
      </div>
    </div>
  );
};

export const ProjectsModal = ({ onClose }) => {
  const { language } = useLanguage();
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [isCarouselEntering, setIsCarouselEntering] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [projectsData, setProjectsData] = useState(null);

  // Load projects JSON from public folder
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const jsonFile = language === 'fr' ? '/projects_json/projects_fr.json' : '/projects_json/projects_en.json';
        const response = await fetch(jsonFile);
        const data = await response.json();
        setProjectsData(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, [language]);

  // Get projects based on current language
  const projects = projectsData ? convertJsonToProjects(projectsData) : [];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [carouselItems, setCarouselItems] = useState([]);

  // Update carousel items when projects data changes
  useEffect(() => {
    if (!projectsData) return;

    const projects = convertJsonToProjects(projectsData);
    if (projects.length === 0) return;

    // Create carousel with 5 copies of the projects for infinite scrolling
    // With 3 projects, this creates 15 items total
    const items = [];
    for (let i = 0; i < 5; i++) {
      projects.forEach((project) => {
        items.push({ ...project, carouselId: `${project.id}-${i}` });
      });
    }
    setCarouselItems(items);
  }, [projectsData]);

  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isHoveringArrows, setIsHoveringArrows] = useState(null); // 'left', 'right', or null
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [imageRotation, setImageRotation] = useState({ x: 0, y: 0 });
  const [isMinimizingCarousel, setIsMinimizingCarousel] = useState(false);

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const lastDragTime = useRef(null);
  const lastDragPosition = useRef(null);
  const velocityRef = useRef(0);

  const [baseOffset, setBaseOffset] = useState(0);

  const centerIndex = Math.floor(carouselItems.length / 2);
  const [virtualCenter, setVirtualCenter] = useState(() => Math.floor(carouselItems.length / 2));
  const [animStage, setAnimStage] = useState("idle"); // 'idle' | 'scaleDown' | 'scaleUp' | 'translating'

  const currentProject = carouselItems[virtualCenter];
  const projectIndex = currentProject ? projects.findIndex((p) => p.id === currentProject.id) : -1;

  // Separate state for close button to prevent re-renders affecting it
  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 800); // Wait for cross and button fade + carousel animation
  };

  // Helper to calculate the distance between two adjacent items (step)
  const getStep = () => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    const a = track.children[0].getBoundingClientRect();
    const b = track.children[1].getBoundingClientRect();
    return isMobile ? (b.top - a.top) : (b.left - a.left);
  };

  // Center the middle item on mount and on resize
  React.useEffect(() => {
    const recalc = () => {
      // Don't recalculate during transitions to avoid interfering with animations
      if (isTransitioning) return;

      const track = trackRef.current;
      if (!track) return;
      const centerItem = track.children[centerIndex];
      if (!centerItem) return;
      const rect = centerItem.getBoundingClientRect();

      if (isMobile) {
        const centerY = rect.top + rect.height / 2;
        const delta = window.innerHeight / 2 - centerY;
        setBaseOffset(delta);
      } else {
        const centerX = rect.left + rect.width / 2;
        const delta = window.innerWidth / 2 - centerX;
        setBaseOffset(delta);
      }
    };

    // Delay initial calculation to let DOM settle
    const timer = setTimeout(recalc, 100);
    window.addEventListener("resize", recalc);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", recalc);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex, isMobile]);

  // keep virtualCenter synced when carouselItems length/structure changes
  React.useEffect(() => {
    setVirtualCenter(Math.floor(carouselItems.length / 2));
  }, [carouselItems.length]);


  const handleNext = useCallback(() => {
    if (isTransitioning || animStage !== "idle") return;
    setIsTransitioning(true);
    const step = getStep();
    const center = virtualCenter;

    // 1) scale current down
    setAnimStage("scaleDown");

    setTimeout(() => {
      // 2) make next item visually big
      setVirtualCenter(center + 1);
      setAnimStage("scaleUp");

      setTimeout(() => {
        // 3) translate so the big item moves into center
        setAnimStage("translating");
        // clear any lingering dragOffset so transform animates from the current dragged position
        setDragOffset(0);
        setTranslateX((prev) => prev - step);

        setTimeout(() => {
          // rotate items after animation
          setCarouselItems((prev) => {
            const newItems = [...prev];
            const firstItem = newItems.shift();
            newItems.push(firstItem);
            return newItems;
          });
          setTranslateX(0);
          // reset virtual center back to middle index
          setVirtualCenter(Math.floor(carouselItems.length / 2));
          setAnimStage("idle");
          setIsTransitioning(false);
        }, 800);
      }, 150);
    }, 150);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || animStage !== "idle") return;
    setIsTransitioning(true);
    const step = getStep();
    const center = virtualCenter;

    // 1) scale current down
    setAnimStage("scaleDown");

    setTimeout(() => {
      // 2) make previous item visually big
      setVirtualCenter(center - 1);
      setAnimStage("scaleUp");

      setTimeout(() => {
        // 3) translate so the big item moves into center
        setAnimStage("translating");
        // clear any lingering dragOffset so transform animates from the current dragged position
        setDragOffset(0);
        setTranslateX((prev) => prev + step);

        setTimeout(() => {
          // rotate items after animation
          setCarouselItems((prev) => {
            const newItems = [...prev];
            const lastItem = newItems.pop();
            newItems.unshift(lastItem);
            return newItems;
          });
          setTranslateX(0);
          // reset virtual center back to middle index
          setVirtualCenter(Math.floor(carouselItems.length / 2));
          setAnimStage("idle");
          setIsTransitioning(false);
        }, 800);
      }, 150);
    }, 150);
  }, [isTransitioning]);

  // Click-to-jump: move the carousel by n items (positive => to the right/next, negative => to the left/prev)
  const handleMoveBy = useCallback((n) => {
    if (!n) return;
    if (isTransitioning || animStage !== "idle") return;

    const step = getStep();
    const itemsToMove = Math.abs(n);
    if (!step || itemsToMove === 0) return;

    setIsTransitioning(true);
    const center = virtualCenter;
    const movingPrev = n < 0;
    const totalStep = step * itemsToMove;

    // 1) scale current down
    setAnimStage("scaleDown");

    setTimeout(() => {
      // 2) promote target visually
      setVirtualCenter(movingPrev ? center - itemsToMove : center + itemsToMove);
      setAnimStage("scaleUp");

      setTimeout(() => {
        // 3) translate track so the promoted item slides to center
        setAnimStage("translating");
        setDragOffset(0);
        setTranslateX((prev) => prev + (movingPrev ? totalStep : -totalStep));

        setTimeout(() => {
          // 4) rotate array by itemsToMove in the right direction
          setCarouselItems((prev) => {
            const newItems = [...prev];
            if (movingPrev) {
              for (let i = 0; i < itemsToMove; i++) {
                const last = newItems.pop();
                newItems.unshift(last);
              }
            } else {
              for (let i = 0; i < itemsToMove; i++) {
                const first = newItems.shift();
                newItems.push(first);
              }
            }
            return newItems;
          });

          // reset transforms and states
          setTranslateX(0);
          setVirtualCenter(Math.floor(carouselItems.length / 2));
          setAnimStage("idle");
          setIsTransitioning(false);
        }, 800);
      }, 150);
    }, 150);
  }, [isTransitioning, animStage, virtualCenter, carouselItems.length]);

  const handleMouseDown = (e) => {
    if (isTransitioning || animStage !== "idle") return;
    setIsDragging(true);
    const position = isMobile ? e.clientY : e.clientX;
    setDragStart(position);
    setDragOffset(0);
    lastDragTime.current = Date.now();
    lastDragPosition.current = position;
    velocityRef.current = 0;
    // immediately scale the current item down for drag feedback
    setAnimStage("scaleDown");
  };

  const handleTouchStart = (e) => {
    if (!isMobile || isTransitioning || animStage !== "idle") return;
    setIsDragging(true);
    const position = e.touches[0].clientY;
    setDragStart(position);
    setDragOffset(0);
    lastDragTime.current = Date.now();
    lastDragPosition.current = position;
    velocityRef.current = 0;
    setAnimStage("scaleDown");
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging || dragStart === null) return;
    const position = e.touches[0].clientY;
    const diff = position - dragStart;
    setDragOffset(diff);

    const now = Date.now();
    const timeDelta = now - lastDragTime.current;
    if (timeDelta > 0 && lastDragPosition.current !== null) {
      const positionDelta = position - lastDragPosition.current;
      velocityRef.current = positionDelta / timeDelta;
    }
    lastDragTime.current = now;
    lastDragPosition.current = position;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    handleMouseUp();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || dragStart === null) return;
    const position = isMobile ? e.clientY : e.clientX;
    const diff = position - dragStart;
    setDragOffset(diff);

    // Calculate velocity for momentum
    const now = Date.now();
    const timeDelta = now - lastDragTime.current;
    if (timeDelta > 0 && lastDragPosition.current !== null) {
      const positionDelta = position - lastDragPosition.current;
      velocityRef.current = positionDelta / timeDelta; // pixels per millisecond
    }
    lastDragTime.current = now;
    lastDragPosition.current = position;
  }, [isDragging, dragStart, isMobile]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const step = getStep() || 1; // pixels between adjacent items
    const dragThreshold = 50;

    const dragDistance = Math.abs(dragOffset);

    // Apply momentum: if velocity is high enough, add extra items to move
    const velocity = velocityRef.current; // pixels per millisecond
    const momentumThreshold = 0.8; // minimum velocity to trigger momentum (higher = less sensitive)
    let momentumItems = 0;

    if (Math.abs(velocity) > momentumThreshold) {
      // Convert velocity to items: higher velocity = more items
      momentumItems = Math.floor(Math.abs(velocity) * 0.8); // reduced multiplier for less distance
      momentumItems = Math.min(momentumItems, 2); // cap at 2 extra items (reduced from 3)
    }

    let itemsToMove = Math.floor(dragDistance / step) + momentumItems;
    if (dragDistance > dragThreshold && itemsToMove === 0) itemsToMove = 1;

    // if not enough drag and no momentum, just reset scale
    if (dragDistance <= dragThreshold && momentumItems === 0) {
      setAnimStage("idle");
      setDragStart(null);
      setDragOffset(0);
      velocityRef.current = 0;
      return;
    }

    if (isTransitioning || animStage !== "scaleDown") {
      // already animating or not in correct stage
      setDragStart(null);
      setDragOffset(0);
      return;
    }

    setIsTransitioning(true);
    const center = virtualCenter;
    const totalStep = step * Math.max(1, itemsToMove);

    // direction: use velocity if strong enough, otherwise use dragOffset
    const movingPrev = Math.abs(velocity) > momentumThreshold ? velocity > 0 : dragOffset > 0;

    // Reset velocity
    velocityRef.current = 0;

    // Skip scale animations for momentum - go straight to translate for continuous motion
    setVirtualCenter(movingPrev ? center - itemsToMove : center + itemsToMove);
    setAnimStage("translating");

    // Clear dragOffset and start translate immediately
    setDragOffset(0);
    setTranslateX((prev) => prev + (movingPrev ? totalStep : -totalStep));

    setTimeout(() => {
      // rotate array by itemsToMove in the correct direction
      setCarouselItems((prev) => {
        const newItems = [...prev];
        if (movingPrev) {
          for (let i = 0; i < Math.max(1, itemsToMove); i++) {
            const last = newItems.pop();
            newItems.unshift(last);
          }
        } else {
          for (let i = 0; i < Math.max(1, itemsToMove); i++) {
            const first = newItems.shift();
            newItems.push(first);
          }
        }
        return newItems;
      });

      setTranslateX(0);
      setVirtualCenter(Math.floor(carouselItems.length / 2));
      setAnimStage("idle");
      setIsTransitioning(false);
      setDragStart(null);
      setDragOffset(0);
    }, 800);
  }, [isDragging, dragOffset, animStage, isTransitioning, virtualCenter, carouselItems.length]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  // Add mouse move and up listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleOpenProjectDetail = (project) => {
    setSelectedProject(project);
    setIsMinimizingCarousel(true);
  };

  const handleBackToCarousel = () => {
    setShowProjectDetail(false);
    setScrollToBottom(false);
    setIsCarouselEntering(true);
    setIsMinimizingCarousel(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 600);
  };

  // Reset entrance animation after it completes
  React.useEffect(() => {
    if (isCarouselEntering) {
      const timer = setTimeout(() => {
        setIsCarouselEntering(false);
      }, 1000); // Match animation duration + stagger (reduced from 2000ms)
      return () => clearTimeout(timer);
    }
  }, [isCarouselEntering]);

  // Handle carousel minimization and project detail reveal
  React.useEffect(() => {
    if (isMinimizingCarousel) {
      const timer = setTimeout(() => {
        setShowProjectDetail(true);
        setIsMinimizingCarousel(false);
      }, 650); // Wait for carousel minimization animation to complete
      return () => clearTimeout(timer);
    }
  }, [isMinimizingCarousel]);

  const containerRefForScroll = useRef(null);

  // Show loading if projects haven't loaded yet
  if (!projectsData || carouselItems.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  // Show project detail page if selected
  if (showProjectDetail && selectedProject) {
    return (
      <>
        {/* Close button overlay - always visible, independent layer */}
        <CustomCloseButton onClick={handleCloseClick} isClosing={isClosing} />

        {/* Project detail page */}
        <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-800 ${isClosing ? "opacity-0" : "opacity-100"}`}>
          <ProjectDetail
            project={selectedProject}
            onBack={handleBackToCarousel}
            onClose={handleCloseClick}
            scrollToBottom={scrollToBottom}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Close button overlay - always visible, independent layer */}
      <CustomCloseButton onClick={handleCloseClick} isClosing={isClosing} />

      {/* Carousel container */}
      <div
        ref={containerRefForScroll}
        className={`fixed inset-0 z-40 bg-black flex flex-col overflow-hidden transition-all duration-600 ${isMinimizingCarousel || isClosing ? "opacity-0" : showProjectDetail ? "opacity-0" : "opacity-100"
          }`}
        style={
          !showProjectDetail && selectedProject && !isMinimizingCarousel
            ? { animation: "carousel-reveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }
            : isCarouselEntering
              ? { animation: "carousel-bg-fade 0.8s ease-out forwards" }
              : {}
        }
        onClick={handleCloseClick}
      >
        {/* Background grain/shards behind images for dark-mode feel */}
        <JsBackground tint intensity={0.1} />

        {/* Main carousel container */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing select-none relative w-full"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Carousel track */}
          <div
            ref={trackRef}
            className={isMobile ? "flex flex-col items-center gap-4" : "flex items-center gap-4"}
            style={{
              transition: isTransitioning ? "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
              transform: isMobile
                ? `translateY(${baseOffset + translateX + dragOffset}px)`
                : `translateX(${baseOffset + translateX + dragOffset}px)`,
            }}
          >
            {carouselItems.map((item, idx) => {
              // Calculate stagger delay based on distance from center
              const distanceFromCenter = Math.abs(idx - virtualCenter);
              const staggerDelay = distanceFromCenter * 0.05; // 50ms per item (reduced from 100ms)

              // Different animation for center vs side items to match final scales
              const animationStyle = isCarouselEntering
                ? idx === virtualCenter
                  ? `imageGrowInCenter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}s both`
                  : `imageGrowInSide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}s both`
                : "none";

              return (
                <div
                  key={item.carouselId}
                  className={`flex-shrink-0 relative rounded-lg transition-all duration-600 ${
                    // clickable center image (open detail) OR side images (jump)
                    (idx === virtualCenter && animStage !== "scaleDown" && !isDragging && !isTransitioning) ||
                      (idx !== virtualCenter && animStage === "idle" && !isDragging && !isTransitioning)
                      ? "cursor-pointer hover:brightness-150"
                      : ""
                    }`}
                  onClick={() => {
                    // Center image: open project detail
                    if (
                      idx === virtualCenter &&
                      animStage !== "scaleDown" &&
                      !isDragging &&
                      !isTransitioning
                    ) {
                      const originalProject = projects.find((p) => p.id === item.id);
                      handleOpenProjectDetail(originalProject);
                      return;
                    }

                    // Side images: jump to that item by sliding n steps
                    if (!isDragging && !isTransitioning && animStage === "idle") {
                      const diff = idx - virtualCenter; // positive => move next, negative => move prev
                      if (diff !== 0) handleMoveBy(diff);
                    }
                  }}
                  style={{
                    width: isMobile ? "80vw" : "45vw",
                    height: isMobile ? "40vh" : "50vh",
                    // Only apply transform if NOT animating on entrance, to avoid conflicts with animation
                    transform: isCarouselEntering
                      ? "none"
                      : animStage === "scaleDown"
                        ? idx === virtualCenter
                          ? "scale(0.9)"
                          : "scale(0.9)"
                        : idx === virtualCenter
                          ? "scale(1.25)"
                          : "scale(0.9)",
                    opacity: isCarouselEntering ? undefined : idx === virtualCenter && animStage !== "scaleDown" ? 1 : 0.3,
                    zIndex: idx === virtualCenter && animStage !== "scaleDown" ? 20 : 10,
                    filter: isCarouselEntering ? "brightness(1)" : idx === virtualCenter && animStage !== "scaleDown" ? "brightness(1.2)" : "brightness(0.8)",
                    boxSizing: "border-box",
                    overflow: "visible",
                    perspective: "1000px",
                    animation: animationStyle,
                    transition: isCarouselEntering ? "none" : "all 0.6s ease-out",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-contain block"
                    draggable={false}
                    onMouseEnter={() => setIsHoveringImage(true)}
                    onMouseLeave={() => {
                      setIsHoveringImage(false);
                      setImageRotation({ x: 0, y: 0 });
                    }}
                    onMouseMove={(e) => {
                      if (idx === virtualCenter && isHoveringImage) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (centerY - y) / 35;
                        const rotateY = (x - centerX) / 35;
                        setImageRotation({ x: rotateX, y: rotateY });
                      }
                    }}
                    style={{
                      transform:
                        isMinimizingCarousel && idx === virtualCenter
                          ? "scale(0.3)"
                          : idx === virtualCenter && isDragging
                            ? "scale(0.98)"
                            : idx === virtualCenter && isHoveringImage
                              ? `scale(1.05) rotateX(${imageRotation.x}deg) rotateY(${imageRotation.y}deg)`
                              : "scale(1)",
                      transition: isDragging ? "none" : isMinimizingCarousel ? "transform 0.6s ease-out" : isHoveringImage ? "transform 0.05s ease-out" : "transform 0.3s ease-out",
                      paddingLeft: "2vw",
                      paddingRight: "2vw",
                      paddingTop: "2vh",
                      paddingBottom: "2vh",
                      height: "100%",
                      transformStyle: "preserve-3d",
                    }}
                  />
                </div>
              );
            })}
          </div>


        </div>

        {/* Footer removed per user request - keeps modal cleaner */}

        {/* Bottom navigation with connected arrows - desktop only */}
        {!isMobile && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-transparent"
          style={{ height: "15%" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Single arrow element <---> that responds to clicks on arrow tips */}
          <button
            className="relative flex items-center justify-center cursor-pointer transition-all"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              width: "fit-content",
              height: "fit-content",
            }}
            onMouseEnter={() => setIsHoveringArrows('both')}
            onMouseLeave={() => setIsHoveringArrows(null)}
          >
            {/* Centered double-sided arrow */}
            <img
              src="https://static.thenounproject.com/png/785425-200.png"
              alt="navigation arrows"
              className="cursor-pointer"
              style={{
                width: isMobile ? "5vw" : "10vw",
                height: isMobile ? "10vw" : "5vw",
                filter: isHoveringArrows ? 'invert(1) brightness(1.2)' : 'invert(1) brightness(0.8)',
                transform: isMobile
                  ? isHoveringArrows ? 'rotate(90deg) scale(1.1)' : 'rotate(90deg) scale(1)'
                  : isHoveringArrows ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease-out, clip-path 0.2s ease-out',
                zIndex: 60,
                clipPath: isMobile
                  ? (isHoveringArrows === 'right' ? 'inset(0 0 50% 0)' : isHoveringArrows === 'left' ? 'inset(50% 0 0 0)' : 'inset(0)')
                  : (isHoveringArrows === 'right' ? 'inset(0 0 0 50%)' : isHoveringArrows === 'left' ? 'inset(0 50% 0 0)' : 'inset(0)'),
              }}
            />

            {/* Hidden clickable areas for left and right navigation */}
            <div
              className="absolute cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handlePrev();
              }}
              onMouseEnter={() => setIsHoveringArrows('left')}
              onMouseLeave={() => setIsHoveringArrows('both')}
              style={isMobile ? {
                left: 0,
                right: 0,
                top: 0,
                height: "50%",
                zIndex: 70,
                background: "transparent",
              } : {
                left: 0,
                top: 0,
                bottom: 0,
                width: "50%",
                zIndex: 70,
                background: "transparent",
              }}
            />
            <div
              className="absolute cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleNext();
              }}
              onMouseEnter={() => setIsHoveringArrows('right')}
              onMouseLeave={() => setIsHoveringArrows('both')}
              style={isMobile ? {
                left: 0,
                right: 0,
                bottom: 0,
                height: "50%",
                zIndex: 70,
                background: "transparent",
              } : {
                right: 0,
                top: 0,
                bottom: 0,
                width: "50%",
                zIndex: 70,
                background: "transparent",
              }}
            />
          </button>

          {/* Instructions hint */}
          <div className="text-center pointer-events-none" style={{ marginTop: "2vh" }}>
            <p className="uppercase tracking-widest" style={{ fontSize: "1vw", color: "rgba(255, 255, 255, 0.2)" }}>
              Drag • Click Arrows
            </p>
          </div>
        </div>
        )}
      </div>
    </>
  );
};
