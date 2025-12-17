import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AboutSection } from "./components/AboutSection";
import { ProjectsModal } from "./components/ProjectsModal";
import { TerminalPopup } from "./components/TerminalPopup";
import { ContactSection } from "./components/ContactSection";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AboutPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "About | Raphael Skal - Portfolio";
  }, []);
  return <AboutSection onClose={() => navigate('/')} />;
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Projects | Raphael Skal - Portfolio";
  }, []);
  return <ProjectsModal onClose={() => navigate('/')} />;
};

const ContactPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Contact | Raphael Skal - Portfolio";
  }, []);
  return (
    <TerminalPopup title="CONTACT.EXE" onClose={() => navigate('/')}>
      <ContactSection isPopup />
    </TerminalPopup>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
      <Route index element={<Home key="home" />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/project/:projectKey" element={<ProjectsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <>
      <Toaster />
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </>
  );
}

export default App;
