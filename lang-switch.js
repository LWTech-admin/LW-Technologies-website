(function () {
  var STORAGE_KEY = "lwtech_lang";

  function getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function setStoredLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      return;
    }
  }

  function getBrowserLanguage() {
    var language = "en";
    if (navigator.languages && navigator.languages.length > 0) {
      language = navigator.languages[0];
    } else if (navigator.language) {
      language = navigator.language;
    }
    return String(language || "en").toLowerCase();
  }

  function normalizeLanguage(lang) {
    return lang === "fr" ? "fr" : "en";
  }

  var translations = {
    en: {
      navAria: "Main",
      title: "LW Technologies | Engineering Consulting in Robotics, Electronics & Mechanical Design",
      description: "LW Technologies provides engineering consulting in robotics, mechatronics, electronics, and mechanical design from Geneva, with expertise in medical technology, railway, and space engineering.",
      ogLocale: "en_CH",
      ogTitle: "LW Technologies | Engineering Consulting in Robotics, Electronics & Mechanical Design",
      ogDescription: "Engineering consulting in robotics, mechatronics, electronics, and mechanical design in Geneva.",
      twitterTitle: "LW Technologies | Engineering Consulting in Robotics, Electronics & Mechanical Design",
      twitterDescription: "Engineering consulting in robotics, mechatronics, electronics, and mechanical design in Geneva.",
      navAbout: "About",
      navServices: "Services",
      navWork: "Projects",
      navContact: "Contact",
      heroPill: "Engineering on Demand",
      heroTitle: "Advanced Robotics, Electronics, and Mechanical Innovation.",
      heroDesc: "LW Technologies delivers precision engineering solutions from Geneva, combining mechatronics, embedded electronics, and mechanical design for high-reliability industrial and research systems.",
      heroCtaPrimary: "Start a Project",
      heroCtaSecondary: "View Our Work",
      capPill: "Capabilities",
      stat1Title: "Robotics",
      stat1Desc: "Autonomous and mechatronic systems",
      stat2Title: "Electronics",
      stat2Desc: "Custom PCB, drivers, and embedded control",
      stat3Title: "Mechanical",
      stat3Desc: "High-load structures and precision design",
      stat4Title: "Cross-Sector",
      stat4Desc: "Industrial, Medical, railway, and space engineering",
      aboutPill: "About",
      aboutTitle: "Built for complex engineering challenges.",
      aboutDesc: "At LW Technologies, we draw on our background in industrial, medical, railway, and space engineering to deliver innovative, tailor-made solutions. From product development to specialized systems for industry and research, each engagement is designed around your technical and operational requirements.",
      servicesPill: "Services",
      servicesTitle: "Core expertise and execution.",
      service1Title: "Robotic & Mechatronic Systems",
      service1Desc: "Development of custom robotic and mechatronic solutions, from concept and prototyping to integration and deployment.",
      service2Title: "Electronics Design",
      service2Desc: "Design and development of electronic hardware, including PCB layouts, embedded systems, and control software tailored to your requirements.",
      service3Title: "Mechanical Design",
      service3Desc: "Engineering of structures, components, and systems with a focus on functionality, manufacturability, and durability using modern CAD and simulation tools.",
      projectsPill: "Projects",
      projectsTitle: "Selected work.",
      project1Title: "Autonomous Vision System",
      project1Desc: "Visual-SLAM and path planning capabilities for mobile inspection robots.",
      project2Title: "Custom BLDC Servo Drivers",
      project2Desc: "High-performance motor drivers with precise torque, speed, and position control.",
      project3Title: "Medical Mechanical System",
      project3Desc: "Custom structure designed for a 15-ton payload with dedicated radiotherapy actuation.",
      contactPill: "Contact",
      contactTitle: "Let’s build your next system.",
      contactDesc: "For project inquiries, use the form or contact us directly.",
      contactEmailLabel: "Email:",
      contactAddressLabel: "Address:",
      labelContactName: "Your Name",
      labelContactEmail: "Your Email",
      labelContactSubject: "Subject",
      labelContactMessage: "Your Message",
      labelContactCompany: "Company",
      placeholderName: "Your Name",
      placeholderEmail: "Your Email",
      placeholderSubject: "Subject (optional)",
      placeholderMessage: "Your Message",
      submit: "Send Message",
      footerCopy: "© 2026 LW Technologies Sàrl | All rights reserved"
    },
    fr: {
      navAria: "Navigation principale",
      title: "LW Technologies | Conseil en ingénierie robotique, électronique et conception mécanique",
      description: "LW Technologies propose du conseil en ingénierie robotique, mécatronique, électronique et conception mécanique depuis Genève, avec une expertise en technologies médicales, ferroviaires et spatiales.",
      ogLocale: "fr_CH",
      ogTitle: "LW Technologies | Conseil en ingénierie robotique, électronique et conception mécanique",
      ogDescription: "Conseil en ingénierie robotique, mécatronique, électronique et conception mécanique à Genève.",
      twitterTitle: "LW Technologies | Conseil en ingénierie robotique, électronique et conception mécanique",
      twitterDescription: "Conseil en ingénierie robotique, mécatronique, électronique et conception mécanique à Genève.",
      navAbout: "À propos",
      navServices: "Services",
      navWork: "Projets",
      navContact: "Contact",
      heroPill: "Ingénierie sur demande",
      heroTitle: "Robotique avancée, électronique et innovation mécanique.",
      heroDesc: "LW Technologies fournit des solutions d’ingénierie de précision depuis Genève, en combinant mécatronique, électronique embarquée et conception mécanique pour des systèmes industriels et de recherche à haute fiabilité.",
      heroCtaPrimary: "Démarrer un projet",
      heroCtaSecondary: "Voir nos réalisations",
      capPill: "Compétences",
      stat1Title: "Robotique",
      stat1Desc: "Systèmes autonomes et mécatroniques",
      stat2Title: "Électronique",
      stat2Desc: "PCB sur mesure, drivers et contrôle embarqué",
      stat3Title: "Mécanique",
      stat3Desc: "Structures à forte charge et conception de précision",
      stat4Title: "Multi-secteurs",
      stat4Desc: "Industrie, médical, ferroviaire et spatial",
      aboutPill: "À propos",
      aboutTitle: "Conçu pour les défis d’ingénierie complexes.",
      aboutDesc: "Chez LW Technologies, nous nous appuyons sur notre expérience en ingénierie industrielle, médicale, ferroviaire et spatiale pour proposer des solutions innovantes et sur mesure. Du développement produit aux systèmes spécialisés pour l’industrie et la recherche, chaque mission est construite selon vos exigences techniques et opérationnelles.",
      servicesPill: "Services",
      servicesTitle: "Expertise clé et exécution.",
      service1Title: "Systèmes robotiques & mécatroniques",
      service1Desc: "Développement de solutions robotiques et mécatroniques sur mesure, du concept et prototypage jusqu’à l’intégration et le déploiement.",
      service2Title: "Conception électronique",
      service2Desc: "Conception et développement de matériel électronique, incluant PCB, systèmes embarqués et logiciels de contrôle adaptés à vos besoins.",
      service3Title: "Conception mécanique",
      service3Desc: "Ingénierie de structures, composants et systèmes avec un focus sur la fonctionnalité, la fabricabilité et la durabilité, à l’aide d’outils CAD et simulation modernes.",
      projectsPill: "Projets",
      projectsTitle: "Réalisations sélectionnées.",
      project1Title: "Système de vision autonome",
      project1Desc: "Fonctionnalités Visual-SLAM et planification de trajectoire pour robots d’inspection mobiles.",
      project2Title: "Drivers servo BLDC sur mesure",
      project2Desc: "Drivers moteur haute performance avec contrôle précis du couple, de la vitesse et de la position.",
      project3Title: "Système mécanique médical",
      project3Desc: "Structure sur mesure conçue pour une charge de 15 tonnes avec actionnement dédié à la radiothérapie.",
      contactPill: "Contact",
      contactTitle: "Construisons votre prochain système.",
      contactDesc: "Pour vos demandes de projet, utilisez le formulaire ou contactez-nous directement.",
      contactEmailLabel: "Email :",
      contactAddressLabel: "Adresse :",
      labelContactName: "Votre nom",
      labelContactEmail: "Votre email",
      labelContactSubject: "Sujet",
      labelContactMessage: "Votre message",
      labelContactCompany: "Société",
      placeholderName: "Votre nom",
      placeholderEmail: "Votre email",
      placeholderSubject: "Sujet (optionnel)",
      placeholderMessage: "Votre message",
      submit: "Envoyer le message",
      footerCopy: "© 2026 LW Technologies Sàrl | Tous droits réservés"
    }
  };

  var textTargets = {
    navAbout: "nav-about",
    navServices: "nav-services",
    navWork: "nav-work",
    navContact: "nav-contact",
    heroPill: "hero-pill",
    heroTitle: "hero-title",
    heroDesc: "hero-desc",
    heroCtaPrimary: "hero-cta-primary",
    heroCtaSecondary: "hero-cta-secondary",
    capPill: "cap-pill",
    stat1Title: "stat-1-title",
    stat1Desc: "stat-1-desc",
    stat2Title: "stat-2-title",
    stat2Desc: "stat-2-desc",
    stat3Title: "stat-3-title",
    stat3Desc: "stat-3-desc",
    stat4Title: "stat-4-title",
    stat4Desc: "stat-4-desc",
    aboutPill: "about-pill",
    aboutTitle: "about-title",
    aboutDesc: "about-desc",
    servicesPill: "services-pill",
    servicesTitle: "services-title",
    service1Title: "service-1-title",
    service1Desc: "service-1-desc",
    service2Title: "service-2-title",
    service2Desc: "service-2-desc",
    service3Title: "service-3-title",
    service3Desc: "service-3-desc",
    projectsPill: "projects-pill",
    projectsTitle: "projects-title",
    project1Title: "project-1-title",
    project1Desc: "project-1-desc",
    project2Title: "project-2-title",
    project2Desc: "project-2-desc",
    project3Title: "project-3-title",
    project3Desc: "project-3-desc",
    contactPill: "contact-pill",
    contactTitle: "contact-title",
    contactDesc: "contact-desc",
    contactEmailLabel: "contact-email-label",
    contactAddressLabel: "contact-address-label",
    labelContactName: "label-contact-name",
    labelContactEmail: "label-contact-email",
    labelContactSubject: "label-contact-subject",
    labelContactMessage: "label-contact-message",
    labelContactCompany: "label-contact-company",
    submit: "contact-submit",
    footerCopy: "footer-copy"
  };

  function setTextById(id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function setContentById(id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.setAttribute("content", value);
    }
  }

  function applyLanguage(lang) {
    var selected = normalizeLanguage(lang);
    var current = translations[selected];
    document.documentElement.setAttribute("lang", selected);

    document.title = current.title;
    setContentById("meta-description", current.description);
    setContentById("meta-og-locale", current.ogLocale);
    setContentById("meta-og-title", current.ogTitle);
    setContentById("meta-og-description", current.ogDescription);
    setContentById("meta-twitter-title", current.twitterTitle);
    setContentById("meta-twitter-description", current.twitterDescription);

    var nav = document.getElementById("nav-main");
    if (nav) {
      nav.setAttribute("aria-label", current.navAria);
    }

    Object.keys(textTargets).forEach(function (key) {
      if (current[key] !== undefined) {
        setTextById(textTargets[key], current[key]);
      }
    });

    var nameInput = document.getElementById("contact-name");
    var emailInput = document.getElementById("contact-email");
    var subjectInput = document.getElementById("contact-subject");
    var messageInput = document.getElementById("contact-message");
    if (nameInput) {
      nameInput.placeholder = current.placeholderName;
    }
    if (emailInput) {
      emailInput.placeholder = current.placeholderEmail;
    }
    if (subjectInput) {
      subjectInput.placeholder = current.placeholderSubject;
    }
    if (messageInput) {
      messageInput.placeholder = current.placeholderMessage;
    }

    var switchLinks = document.querySelectorAll("[data-lang-switch]");
    switchLinks.forEach(function (link) {
      var linkLang = normalizeLanguage(link.getAttribute("data-lang-switch"));
      if (linkLang === selected) {
        link.setAttribute("aria-current", "true");
        link.classList.add("active");
      } else {
        link.removeAttribute("aria-current");
        link.classList.remove("active");
      }
    });
  }

  var stored = getStoredLanguage();
  var initialLanguage = stored ? normalizeLanguage(stored) : (getBrowserLanguage().indexOf("fr") === 0 ? "fr" : "en");
  applyLanguage(initialLanguage);

  var switchLinks = document.querySelectorAll("[data-lang-switch]");
  switchLinks.forEach(function (link) {
    var linkLang = normalizeLanguage(link.getAttribute("data-lang-switch"));
    link.addEventListener("click", function (event) {
      event.preventDefault();
      setStoredLanguage(linkLang);
      applyLanguage(linkLang);
    });
  });
})();
