import { createContext, useContext, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

const LanguageContext = createContext();

export const translations = {
  en: {
    navbar: {
      title: "Le Skal",
      about: "About",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      name: "Le",
      lastname: "Skal",
      description:
        "Aspiring Data Scientist",
      cta: "View My Work",
      cv: "My CV",
    },
    about: {
      title: "About",
      introduction: "Raphaël Martin, Data Science student at ECE Paris.",
      currentFocus: "Currently pursuing a Bachelor's degree in Data Science and working as a Data Analyst apprentice, aiming to become a Data Scientist.",
      location: "Based in Paris",
      background: "Lived 14 years in Hong Kong and 2 years in the Netherlands.",
      journey: "Got into tech/data science through studies in computer science and AI — initially focused on artificial intelligence in the Netherlands before moving to ECE Paris for a more applied and collaborative computer science program.",
      keyExperiences: "Transition from AI studies to a hands-on data science program at ECE Paris; experience working in group projects and developing real-world data and web applications.",
      whyDataScience: "The ability to turn raw data into actionable insights and use data to guide decisions.",
      problemsToSolve: "Real-world challenges that involve understanding and optimizing systems through data — particularly in digital transformation contexts.",
      areasOfInterest: "Data analysis and machine learning.",
      skillAreas: "Data analysis, machine learning, programming (Python, web development, databases), and data visualization.",
      approachToProblems: "Analytical and structured — combining technical rigor with curiosity to explore data-driven insights.",
      motivation: "Continuous learning and the opportunity to apply technical skills to meaningful, practical problems.",
      coreValues: "Collaboration, adaptability, and clarity in both communication and data interpretation.",
      aspirations: "To become a Data Scientist.",
      fiveYearVision: "Developing expertise in data-driven decision-making within innovative organizations.",
      impact: "Helping businesses and teams transform complex data into clear, actionable strategies.",
      hobbies: "Music production and DJing under the alias c0r3 — performing in Paris and part of a collective in Lille. Also enjoys climbing, biking, sports, and spending time with friends in Parisian cafés.",
      inspiration: "Creativity through music, social connections, and continuous discovery through both technology and art.",
      sectionBackground: "Background",
      sectionLocationHistory: "Location & History",
      sectionJourney: "Journey",
      sectionKeyExperiences: "Key Experiences",
      sectionWhyDataScience: "Why Data Science",
      sectionWhatExcites: "What Excites Me",
      sectionProblems: "Problems to Solve",
      sectionAreas: "Areas of Interest",
      sectionSkills: "Skill Areas",
      sectionApproach: "My Approach",
      sectionProblemSolving: "Problem Solving",
      sectionMotivation: "Motivation",
      sectionValues: "Core Values",
      sectionLookingAhead: "Looking Ahead",
      sectionAspirations: "Aspirations",
      sectionVision: "5-Year Vision",
      sectionImpact: "Impact",
      sectionOutside: "Outside of Work",
      sectionHobbies: "Hobbies & Interests",
      sectionInspiration: "What Keeps Me Inspired",
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Touch",
      description:
        "Have a project in mind or want to collaborate? Feel free to reach out.",
      contactInfo: "Contact Information",
      email: "Email",
      phone: "Phone",
      location: "Location",
      connectWithMe: "Connect With Me",
      sendAMessage: "Send a Message",
      yourName: "Your Name",
      namePlaceholder: "Raphael Martin...",
      yourEmail: "Your Email",
      emailPlaceholder: "john@gmail.com",
      yourMessage: "Your Message",
      messagePlaceholder: "Hello, I'd like to talk about...",
      sendMessage: "Send Message",
      sending: "Sending...",
      messageSent: "Message sent!",
      messageSentDesc: "Thank you for your message. I'll get back to you soon.",
    },
    closeAllProjects: "Close All Projects",
    projectDetail: {
      category: "Category",
      role: "Role",
      timeline: "Timeline",
      liveSite: "Live Site",
      github: "GitHub",
      overview: "Overview",
      challenge: "The Challenge",
      problem: "Problem",
      goal: "Goal",
      constraints: "Constraints",
      techStack: "Tech Stack",
      frontend: "Frontend",
      backend: "Backend",
      tools: "Tools",
      libraries: "Libraries",
      results: "Results",
      technicalAchievements: "Technical Achievements",
      businessImpact: "Business Impact",
      personalGrowth: "Personal Growth",
      keyLearnings: "Key Learnings",
      developmentProcess: "Development Process",
      keyFeatures: "Key Features",
      futureEnhancements: "Future Enhancements",
      conclusion: "Conclusion",
    },
  },
  fr: {
    navbar: {
      title: "Le Skal",
      about: "À Propos",
      projects: "Projets",
      contact: "Contact",
    },
    hero: {
      greeting: "Bonjour, je suis",
      name: "Le",
      lastname: "Skal",
      description:
        "Futur chercheur en IA",
      cta: "Voir Mon Travail",
      cv: "Mon CV",
    },
    about: {
      title: "À",
      introduction: "Raphaël Martin, étudiant en Data Science à l'ECE Paris.",
      currentFocus: "Actuellement en licence de Data Science et en apprentissage en tant que Data Analyst, avec pour objectif de devenir Data Scientist.",
      location: "Basé à Paris",
      background: "A vécu 14 ans à Hong Kong et 2 ans aux Pays-Bas.",
      journey: "Découverte de la technologie et du data science par les études en informatique et IA — d'abord axé sur l'intelligence artificielle aux Pays-Bas avant de rejoindre l'ECE Paris pour un programme informatique plus appliqué et collaboratif.",
      keyExperiences: "Transition des études en IA à un programme de data science pratique à l'ECE Paris; expérience de travail en projets de groupe et développement d'applications data et web réelles.",
      whyDataScience: "La capacité à transformer les données brutes en insights exploitables et utiliser les données pour guider les décisions.",
      problemsToSolve: "Défis réels impliquant la compréhension et l'optimisation de systèmes par les données — particulièrement dans les contextes de transformation numérique.",
      areasOfInterest: "Analyse de données et machine learning.",
      skillAreas: "Analyse de données, machine learning, programmation (Python, développement web, bases de données) et visualisation de données.",
      approachToProblems: "Analytique et structuré — combinant la rigueur technique avec la curiosité pour explorer les insights data-driven.",
      motivation: "L'apprentissage continu et l'opportunité d'appliquer les compétences techniques à des problèmes significatifs et pratiques.",
      coreValues: "Collaboration, adaptabilité et clarté dans la communication et l'interprétation des données.",
      aspirations: "Devenir Data Scientist.",
      fiveYearVision: "Développer une expertise en prise de décision data-driven au sein d'organisations innovantes.",
      impact: "Aider les entreprises et les équipes à transformer des données complexes en stratégies claires et exploitables.",
      hobbies: "Production musicale et DJ sous l'alias c0r3 — se produisant à Paris et faisant partie d'un collectif à Lille. Aime aussi l'escalade, le vélo, le sport et passer du temps avec des amis dans les cafés parisiens.",
      inspiration: "La créativité par la musique, les connexions sociales et la découverte continue par la technologie et l'art.",
      sectionBackground: "Arrière-plan",
      sectionLocationHistory: "Localisation & Historique",
      sectionJourney: "Parcours",
      sectionKeyExperiences: "Expériences Clés",
      sectionWhyDataScience: "Pourquoi Data Science",
      sectionWhatExcites: "Ce qui m'Excite",
      sectionProblems: "Problèmes à Résoudre",
      sectionAreas: "Domaines d'Intérêt",
      sectionSkills: "Domaines de Compétences",
      sectionApproach: "Mon Approche",
      sectionProblemSolving: "Résolution de Problèmes",
      sectionMotivation: "Motivation",
      sectionValues: "Valeurs Fondamentales",
      sectionLookingAhead: "Perspective d'Avenir",
      sectionAspirations: "Aspirations",
      sectionVision: "Vision à 5 Ans",
      sectionImpact: "Impact",
      sectionOutside: "En Dehors du Travail",
      sectionHobbies: "Loisirs & Intérêts",
      sectionInspiration: "Ce qui m'Inspire",
    },
    contact: {
      title: "Rentrons En Contact",
      subtitle: "Contact",
      description:
        "Vous avez un projet en tête ou voulez collaborer? N'hésitez pas à nous contacter.",
      contactInfo: "Informations de Contact",
      email: "Email",
      phone: "Téléphone",
      location: "Localisation",
      connectWithMe: "Me Connecter",
      sendAMessage: "Envoyer un Message",
      yourName: "Votre Nom",
      namePlaceholder: "Raphael Martin...",
      yourEmail: "Votre Email",
      emailPlaceholder: "jean@gmail.com",
      yourMessage: "Votre Message",
      messagePlaceholder: "Bonjour, j'aimerais parler de...",
      sendMessage: "Envoyer le Message",
      sending: "Envoi...",
      messageSent: "Message envoyé!",
      messageSentDesc:
        "Merci pour votre message. Je vous répondrai bientôt.",
    },
    closeAllProjects: "Fermer Tous les Projets",
    projectDetail: {
      category: "Catégorie",
      role: "Rôle",
      timeline: "Chronologie",
      liveSite: "Site en Ligne",
      github: "GitHub",
      overview: "Aperçu",
      challenge: "Le Défi",
      problem: "Problème",
      goal: "Objectif",
      constraints: "Contraintes",
      techStack: "Stack Technique",
      frontend: "Frontend",
      backend: "Backend",
      tools: "Outils",
      libraries: "Bibliothèques",
      results: "Résultats",
      technicalAchievements: "Réalisations Techniques",
      businessImpact: "Impact Commercial",
      personalGrowth: "Croissance Personnelle",
      keyLearnings: "Apprentissages Clés",
      developmentProcess: "Processus de Développement",
      keyFeatures: "Fonctionnalités Clés",
      futureEnhancements: "Améliorations Futures",
      conclusion: "Conclusion",
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const { lang } = useParams();
  const location = useLocation();

  // Get language from URL, localStorage, or default to "en"
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved && (saved === 'en' || saved === 'fr') ? saved : 'en';
  });

  // Update language when URL changes
  useEffect(() => {
    if (lang && (lang === 'en' || lang === 'fr')) {
      setLanguage(lang);
    }
  }, [lang, location.pathname]);

  // Update localStorage and HTML lang attribute when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'fr') {
      setLanguage(newLang);
    }
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
