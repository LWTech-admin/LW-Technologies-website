(function () {
  var STORAGE_KEY = "lwtech_lang";
  var THEME_STORAGE_KEY = "lwtech_theme";
  var themeMode = "auto";

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

  function getStoredThemeMode() {
    try {
      var mode = localStorage.getItem(THEME_STORAGE_KEY);
      if (mode === "light" || mode === "dark") {
        return mode;
      }
      return "auto";
    } catch (error) {
      return "auto";
    }
  }

  function setStoredThemeMode(mode) {
    try {
      if (mode === "light" || mode === "dark") {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
        return;
      }
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      return;
    }
  }

  function setThemeToggleUi(mode, lang) {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) {
      return;
    }

    var selectedLanguage = normalizeLanguage(String(lang || document.documentElement.getAttribute("lang") || "en").toLowerCase());
    var dictionary = translations[selectedLanguage] || translations.en;
    var fallback = translations.en;
    var normalizedMode = mode === "light" || mode === "dark" ? mode : "auto";

    var modeTextKey = "themeAuto";
    if (normalizedMode === "light") {
      modeTextKey = "themeLight";
    }
    if (normalizedMode === "dark") {
      modeTextKey = "themeDark";
    }

    var modeText = dictionary[modeTextKey] || fallback[modeTextKey] || normalizedMode.toUpperCase();
    var modeLabel = dictionary.themeModeLabel || fallback.themeModeLabel || "Theme mode";
    var modeIconSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"></circle><path d="M12 4v16"></path></svg>';
    if (normalizedMode === "light") {
      modeIconSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"></path></svg>';
    }
    if (normalizedMode === "dark") {
      modeIconSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.6 14.3A8.5 8.5 0 1 1 9.7 3.4a7.1 7.1 0 1 0 10.9 10.9z"></path></svg>';
    }

    toggle.innerHTML = modeIconSvg;
    toggle.setAttribute("aria-label", modeLabel + ": " + modeText);
    toggle.setAttribute("title", modeLabel + ": " + modeText);
  }

  function isSystemLightMode() {
    if (!window.matchMedia) {
      return false;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  }

  function updateLogoForTheme(mode) {
    var logo = document.getElementById("img-logo");
    if (!logo) {
      return;
    }

    var normalizedMode = mode === "light" || mode === "dark" ? mode : "auto";
    var effectiveMode = normalizedMode === "auto" ? (isSystemLightMode() ? "light" : "dark") : normalizedMode;

    if (effectiveMode === "light") {
      logo.setAttribute("src", "logo-black.png");
      return;
    }
    logo.setAttribute("src", "logo.png");
  }

  function applyThemeMode(mode) {
    var normalizedMode = mode === "light" || mode === "dark" ? mode : "auto";
    themeMode = normalizedMode;
    if (normalizedMode === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", normalizedMode);
    }
    setThemeToggleUi(normalizedMode);
    updateLogoForTheme(normalizedMode);
  }

  function getNextThemeMode(mode) {
    if (mode === "auto") {
      return "light";
    }
    if (mode === "light") {
      return "dark";
    }
    return "auto";
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
    if (lang === "fr" || lang === "it" || lang === "de") {
      return lang;
    }
    return "en";
  }

  function detectLanguageFromBrowser() {
    var browser = getBrowserLanguage();
    if (browser.indexOf("fr") === 0) {
      return "fr";
    }
    if (browser.indexOf("it") === 0) {
      return "it";
    }
    if (browser.indexOf("de") === 0) {
      return "de";
    }
    return "en";
  }

  function getLanguageFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var lang = params.get("lang");
      if (!lang) {
        return null;
      }
      return normalizeLanguage(String(lang).toLowerCase());
    } catch (error) {
      return null;
    }
  }

  var translations = {
    en: {
      navAria: "Main",
      title: "LW Technologies | Engineering Office in Geneva for Robotics, Electronics & Mechanical Design",
      description: "LW Technologies is an engineering office in Geneva (bureau d’ingénierie / bureau d’ingénieur) specialized in robotics, mechatronics, electronics, and mechanical design for industrial, medical, railway, and space projects.",
      ogLocale: "en_CH",
      ogTitle: "LW Technologies | Engineering Office in Geneva",
      ogDescription: "Engineering office in Geneva (bureau d’ingénierie) for robotics, electronics, and mechanical design.",
      twitterTitle: "LW Technologies | Engineering Office in Geneva",
      twitterDescription: "Engineering office in Geneva (bureau d’ingénierie) for robotics, electronics, and mechanical design.",
      navAbout: "About",
      navServices: "Services",
      navWork: "Projects",
      navContact: "Contact",
      heroPill: "Engineering on Demand",
      heroTitle: "Engineering Office in Geneva for Robotics, Electronics, and Mechanical Design.",
      heroDesc: "LW Technologies is a Geneva engineering office delivering precision solutions by combining mechatronics, embedded electronics, and mechanical design for high-reliability industrial and research systems.",
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
      aboutDesc: "Based in Geneva, Switzerland, LW Technologies draws on its background in industrial, medical, railway, and space engineering to deliver innovative, tailor-made solutions. From product development to specialized systems for industry and research, each engagement is designed around your technical and operational requirements.",
      industryNote: "Clarification: LW Technologies is an engineering consulting company and does not provide locksmith services. If third-party directory listings (including moneyhouse.ch) differ, this official website is the source of truth.",
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
      logoAlt: "LW Technologies logo",
      project1Alt: "Autonomous machine vision system with Visual-SLAM and path planning",
      project2Alt: "Custom BLDC servo motor driver electronics",
      project3Alt: "Custom medical mechanical system for radiotherapy actuation",
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
      footerCopy: "© 2026 LW Technologies Sàrl | All rights reserved",
      themeModeLabel: "Theme mode",
      themeAuto: "AUTO",
      themeLight: "LIGHT",
      themeDark: "DARK"
    },
    fr: {
      navAria: "Navigation principale",
      title: "LW Technologies | Bureau d’ingénieur à Genève : robotique, électronique et mécanique",
      description: "LW Technologies est un bureau d’ingénierie (bureau d’ingénieur) à Genève, Suisse, spécialisé en robotique, mécatronique, électronique et conception mécanique pour des projets industriels, médicaux, ferroviaires et spatiaux.",
      ogLocale: "fr_CH",
      ogTitle: "LW Technologies | Bureau d’ingénierie à Genève",
      ogDescription: "Bureau d’ingénierie à Genève pour la robotique, l’électronique et la conception mécanique.",
      twitterTitle: "LW Technologies | Bureau d’ingénierie à Genève",
      twitterDescription: "Bureau d’ingénierie à Genève pour la robotique, l’électronique et la conception mécanique.",
      navAbout: "À propos",
      navServices: "Services",
      navWork: "Projets",
      navContact: "Contact",
      heroPill: "Ingénierie sur demande",
      heroTitle: "Bureau d’ingénierie à Genève : robotique, électronique et conception mécanique.",
      heroDesc: "LW Technologies est un bureau d’ingénieur à Genève qui fournit des solutions de précision en combinant mécatronique, électronique embarquée et conception mécanique pour des systèmes industriels et de recherche à haute fiabilité.",
      heroCtaPrimary: "Démarrer un projet",
      heroCtaSecondary: "Voir nos projets",
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
      aboutDesc: "Basée à Genève, Suisse, LW Technologies s’appuie sur son expérience en ingénierie industrielle, médicale, ferroviaire et spatiale pour proposer des solutions innovantes et sur mesure. Du développement produit aux systèmes spécialisés pour l’industrie et la recherche, chaque mission est construite selon vos exigences techniques et opérationnelles.",
      industryNote: "Clarification : LW Technologies est une société de conseil en ingénierie et ne fournit pas de services de serrurerie. En cas d’informations différentes sur des annuaires tiers (dont moneyhouse.ch), ce site officiel fait foi.",
      servicesPill: "Services",
      servicesTitle: "Expertise clé et exécution.",
      service1Title: "Systèmes robotiques & mécatroniques",
      service1Desc: "Développement de solutions robotiques et mécatroniques sur mesure, du concept et prototypage jusqu’à l’intégration et le déploiement.",
      service2Title: "Conception électronique",
      service2Desc: "Conception et développement de matériel électronique, incluant PCB, systèmes embarqués et logiciels de contrôle adaptés à vos besoins.",
      service3Title: "Conception mécanique",
      service3Desc: "Ingénierie de structures, composants et systèmes avec un focus sur la fonctionnalité, la fabricabilité et la durabilité, à l’aide d’outils CAD et simulation modernes.",
      projectsPill: "Projets",
      projectsTitle: "Projets sélectionnés.",
      project1Title: "Système de vision autonome",
      project1Desc: "Fonctionnalités Visual-SLAM et planification de trajectoire pour robots d’inspection mobiles.",
      project2Title: "Drivers servo BLDC sur mesure",
      project2Desc: "Drivers moteur haute performance avec contrôle précis du couple, de la vitesse et de la position.",
      project3Title: "Système mécanique médical",
      project3Desc: "Structure sur mesure conçue pour une charge de 15 tonnes avec actionnement dédié à la radiothérapie.",
      logoAlt: "Logo LW Technologies",
      project1Alt: "Système de vision autonome avec Visual-SLAM et planification de trajectoire",
      project2Alt: "Électronique de commande servo BLDC sur mesure",
      project3Alt: "Système mécanique médical sur mesure pour actionnement en radiothérapie",
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
      footerCopy: "© 2026 LW Technologies Sàrl | Tous droits réservés",
      themeModeLabel: "Mode de thème",
      themeAuto: "AUTO",
      themeLight: "CLAIR",
      themeDark: "SOMBRE"
    },
    it: {
      navAria: "Navigazione principale",
      title: "LW Technologies | Consulenza ingegneristica in robotica, elettronica e progettazione meccanica",
      description: "LW Technologies è una società di consulenza ingegneristica con sede a Ginevra, Svizzera, specializzata in robotica, meccatronica, elettronica e progettazione meccanica, con esperienza nei settori medicale, ferroviario e spaziale.",
      ogLocale: "it_CH",
      ogTitle: "LW Technologies | Consulenza ingegneristica in robotica, elettronica e progettazione meccanica",
      ogDescription: "Consulenza ingegneristica in robotica, meccatronica, elettronica e progettazione meccanica a Ginevra, Svizzera.",
      twitterTitle: "LW Technologies | Consulenza ingegneristica in robotica, elettronica e progettazione meccanica",
      twitterDescription: "Consulenza ingegneristica in robotica, meccatronica, elettronica e progettazione meccanica a Ginevra, Svizzera.",
      navAbout: "Chi siamo",
      navServices: "Servizi",
      navWork: "Progetti",
      navContact: "Contatti",
      heroPill: "Ingegneria su richiesta",
      heroTitle: "Robotica avanzata, elettronica e innovazione meccanica.",
      heroDesc: "Da Ginevra, Svizzera, LW Technologies fornisce soluzioni di ingegneria di precisione combinando meccatronica, elettronica embedded e progettazione meccanica per sistemi industriali e di ricerca ad alta affidabilità.",
      heroCtaPrimary: "Avvia un progetto",
      heroCtaSecondary: "Scopri i nostri progetti",
      capPill: "Competenze",
      stat1Title: "Robotica",
      stat1Desc: "Sistemi autonomi e meccatronici",
      stat2Title: "Elettronica",
      stat2Desc: "PCB su misura, driver e controllo embedded",
      stat3Title: "Meccanica",
      stat3Desc: "Strutture ad alto carico e progettazione di precisione",
      stat4Title: "Multi-settore",
      stat4Desc: "Industriale, medicale, ferroviario e spaziale",
      aboutPill: "Chi siamo",
      aboutTitle: "Progettato per sfide ingegneristiche complesse.",
      aboutDesc: "Con sede a Ginevra, Svizzera, LW Technologies valorizza la propria esperienza nell’ingegneria industriale, medicale, ferroviaria e spaziale per offrire soluzioni innovative e su misura. Dallo sviluppo prodotto ai sistemi specializzati per industria e ricerca, ogni incarico è costruito in base alle vostre esigenze tecniche e operative.",
      industryNote: "Chiarimento: LW Technologies è una società di consulenza ingegneristica e non fornisce servizi di fabbro. Se gli elenchi di directory di terze parti (incluso moneyhouse.ch) differiscono, questo sito ufficiale è la fonte di riferimento.",
      servicesPill: "Servizi",
      servicesTitle: "Competenze chiave ed esecuzione.",
      service1Title: "Sistemi robotici e meccatronici",
      service1Desc: "Sviluppo di soluzioni robotiche e meccatroniche personalizzate, dal concept e prototipazione fino all’integrazione e al deployment.",
      service2Title: "Progettazione elettronica",
      service2Desc: "Progettazione e sviluppo di hardware elettronico, inclusi layout PCB, sistemi embedded e software di controllo su misura.",
      service3Title: "Progettazione meccanica",
      service3Desc: "Ingegneria di strutture, componenti e sistemi con focus su funzionalità, producibilità e durabilità, supportata da strumenti CAD e simulazione moderni.",
      projectsPill: "Progetti",
      projectsTitle: "Progetti selezionati.",
      project1Title: "Sistema di visione autonoma",
      project1Desc: "Funzionalità Visual-SLAM e pianificazione del percorso per robot mobili di ispezione.",
      project2Title: "Driver servo BLDC personalizzati",
      project2Desc: "Driver motore ad alte prestazioni con controllo preciso di coppia, velocità e posizione.",
      project3Title: "Sistema meccanico medicale",
      project3Desc: "Struttura personalizzata progettata per un carico di 15 tonnellate con attuazione dedicata alla radioterapia.",
      logoAlt: "Logo LW Technologies",
      project1Alt: "Sistema di visione autonoma con Visual-SLAM e pianificazione del percorso",
      project2Alt: "Elettronica driver servo BLDC personalizzata",
      project3Alt: "Sistema meccanico medicale personalizzato per attuazione radioterapica",
      contactPill: "Contatti",
      contactTitle: "Costruiamo il tuo prossimo sistema.",
      contactDesc: "Per richieste di progetto, usa il modulo oppure contattaci direttamente.",
      contactEmailLabel: "Email:",
      contactAddressLabel: "Indirizzo:",
      labelContactName: "Il tuo nome",
      labelContactEmail: "La tua email",
      labelContactSubject: "Oggetto",
      labelContactMessage: "Il tuo messaggio",
      labelContactCompany: "Azienda",
      placeholderName: "Il tuo nome",
      placeholderEmail: "La tua email",
      placeholderSubject: "Oggetto (opzionale)",
      placeholderMessage: "Il tuo messaggio",
      submit: "Invia messaggio",
      footerCopy: "© 2026 LW Technologies Sàrl | Tutti i diritti riservati",
      themeModeLabel: "Modalità tema",
      themeAuto: "AUTO",
      themeLight: "CHIARO",
      themeDark: "SCURO"
    },
    de: {
      navAria: "Hauptnavigation",
      title: "LW Technologies | Engineering-Beratung in Robotik, Elektronik und mechanischer Konstruktion",
      description: "LW Technologies ist ein Engineering-Beratungsunternehmen mit Sitz in Genf, Schweiz, spezialisiert auf Robotik, Mechatronik, Elektronik und mechanische Konstruktion, mit Erfahrung in Medizintechnik, Bahntechnik und Raumfahrt.",
      ogLocale: "de_CH",
      ogTitle: "LW Technologies | Engineering-Beratung in Robotik, Elektronik und mechanischer Konstruktion",
      ogDescription: "Engineering-Beratung in Robotik, Mechatronik, Elektronik und mechanischer Konstruktion in Genf, Schweiz.",
      twitterTitle: "LW Technologies | Engineering-Beratung in Robotik, Elektronik und mechanischer Konstruktion",
      twitterDescription: "Engineering-Beratung in Robotik, Mechatronik, Elektronik und mechanischer Konstruktion in Genf, Schweiz.",
      navAbout: "Über uns",
      navServices: "Leistungen",
      navWork: "Projekte",
      navContact: "Kontakt",
      heroPill: "Engineering auf Abruf",
      heroTitle: "Fortschrittliche Robotik, Elektronik und mechanische Innovation.",
      heroDesc: "Von Genf, Schweiz aus liefert LW Technologies präzise Engineering-Lösungen und kombiniert Mechatronik, Embedded-Elektronik und mechanische Konstruktion für hochzuverlässige Industrie- und Forschungssysteme.",
      heroCtaPrimary: "Projekt starten",
      heroCtaSecondary: "Unsere Projekte ansehen",
      capPill: "Kompetenzen",
      stat1Title: "Robotik",
      stat1Desc: "Autonome und mechatronische Systeme",
      stat2Title: "Elektronik",
      stat2Desc: "Individuelle PCB, Treiber und Embedded-Steuerung",
      stat3Title: "Mechanik",
      stat3Desc: "Hochlaststrukturen und Präzisionskonstruktion",
      stat4Title: "Branchenübergreifend",
      stat4Desc: "Industrie, Medizintechnik, Bahn und Raumfahrt",
      aboutPill: "Über uns",
      aboutTitle: "Entwickelt für komplexe Engineering-Herausforderungen.",
      aboutDesc: "Mit Sitz in Genf, Schweiz, nutzt LW Technologies seine Erfahrung im Industrie-, Medizin-, Bahn- und Raumfahrtingenieurwesen, um innovative und maßgeschneiderte Lösungen zu liefern. Von der Produktentwicklung bis zu spezialisierten Systemen für Industrie und Forschung wird jedes Projekt auf Ihre technischen und operativen Anforderungen abgestimmt.",
      industryNote: "Klarstellung: LW Technologies ist ein Engineering-Beratungsunternehmen und bietet keine Schlüsseldienstleistungen an. Wenn Angaben in Verzeichnissen von Drittanbietern (einschließlich moneyhouse.ch) abweichen, ist diese offizielle Website die maßgebliche Quelle.",
      servicesPill: "Leistungen",
      servicesTitle: "Kernkompetenz und Umsetzung.",
      service1Title: "Robotik- und mechatronische Systeme",
      service1Desc: "Entwicklung kundenspezifischer Robotik- und Mechatroniklösungen – von Konzept und Prototyping bis Integration und Deployment.",
      service2Title: "Elektronikentwicklung",
      service2Desc: "Entwicklung elektronischer Hardware inklusive PCB-Layouts, Embedded-Systemen und maßgeschneiderter Steuerungssoftware.",
      service3Title: "Mechanische Konstruktion",
      service3Desc: "Engineering von Strukturen, Komponenten und Systemen mit Fokus auf Funktionalität, Fertigbarkeit und Langlebigkeit, unterstützt durch moderne CAD- und Simulationswerkzeuge.",
      projectsPill: "Projekte",
      projectsTitle: "Ausgewählte Projekte.",
      project1Title: "Autonomes Vision-System",
      project1Desc: "Visual-SLAM- und Pfadplanungsfunktionen für mobile Inspektionsroboter.",
      project2Title: "Kundenspezifische BLDC-Servotreiber",
      project2Desc: "Hochleistungs-Motortreiber mit präziser Drehmoment-, Geschwindigkeits- und Positionsregelung.",
      project3Title: "Medizinisches mechanisches System",
      project3Desc: "Kundenspezifische Struktur für 15 Tonnen Nutzlast mit spezieller Aktuierung für die Radiotherapie.",
      logoAlt: "LW Technologies Logo",
      project1Alt: "Autonomes maschinelles Vision-System mit Visual-SLAM und Pfadplanung",
      project2Alt: "Kundenspezifische BLDC-Servotreiber-Elektronik",
      project3Alt: "Kundenspezifisches medizinisches mechanisches System für Radiotherapie-Aktuierung",
      contactPill: "Kontakt",
      contactTitle: "Lassen Sie uns Ihr nächstes System bauen.",
      contactDesc: "Für Projektanfragen nutzen Sie das Formular oder kontaktieren Sie uns direkt.",
      contactEmailLabel: "E-Mail:",
      contactAddressLabel: "Adresse:",
      labelContactName: "Ihr Name",
      labelContactEmail: "Ihre E-Mail",
      labelContactSubject: "Betreff",
      labelContactMessage: "Ihre Nachricht",
      labelContactCompany: "Unternehmen",
      placeholderName: "Ihr Name",
      placeholderEmail: "Ihre E-Mail",
      placeholderSubject: "Betreff (optional)",
      placeholderMessage: "Ihre Nachricht",
      submit: "Nachricht senden",
      footerCopy: "© 2026 LW Technologies Sàrl | Alle Rechte vorbehalten",
      themeModeLabel: "Themenmodus",
      themeAuto: "AUTO",
      themeLight: "HELL",
      themeDark: "DUNKEL"
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
    industryNote: "industry-note",
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

  function setAttributeById(id, attributeName, value) {
    var node = document.getElementById(id);
    if (node) {
      node.setAttribute(attributeName, value);
    }
  }

  function setLanguageDropdownState(isOpen) {
    var root = document.getElementById("lang-switch");
    var trigger = document.getElementById("lang-trigger");
    if (!root || !trigger) {
      return;
    }
    if (isOpen) {
      root.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    } else {
      root.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
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
    setContentById("meta-og-image-alt", current.logoAlt);
    setContentById("meta-twitter-title", current.twitterTitle);
    setContentById("meta-twitter-description", current.twitterDescription);
    setContentById("meta-twitter-image-alt", current.logoAlt);

    setAttributeById("img-logo", "alt", current.logoAlt);
    setAttributeById("img-project-1", "alt", current.project1Alt);
    setAttributeById("img-project-2", "alt", current.project2Alt);
    setAttributeById("img-project-3", "alt", current.project3Alt);

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

    setTextById("lang-current", selected.toUpperCase());
    setThemeToggleUi(themeMode, selected);
  }

  var stored = getStoredLanguage();
  var queryLanguage = getLanguageFromQuery();
  if (queryLanguage) {
    setStoredLanguage(queryLanguage);
  }
  var initialLanguage = queryLanguage || (stored ? normalizeLanguage(stored) : detectLanguageFromBrowser());
  themeMode = getStoredThemeMode();
  applyLanguage(initialLanguage);
  applyThemeMode(themeMode);

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      themeMode = getNextThemeMode(themeMode);
      setStoredThemeMode(themeMode);
      applyThemeMode(themeMode);
    });
  }

  if (window.matchMedia) {
    var colorSchemeMedia = window.matchMedia("(prefers-color-scheme: light)");
    if (typeof colorSchemeMedia.addEventListener === "function") {
      colorSchemeMedia.addEventListener("change", function () {
        if (themeMode === "auto") {
          updateLogoForTheme("auto");
        }
      });
    } else if (typeof colorSchemeMedia.addListener === "function") {
      colorSchemeMedia.addListener(function () {
        if (themeMode === "auto") {
          updateLogoForTheme("auto");
        }
      });
    }
  }

  var switchLinks = document.querySelectorAll("[data-lang-switch]");
  switchLinks.forEach(function (link) {
    var linkLang = normalizeLanguage(link.getAttribute("data-lang-switch"));
    link.addEventListener("click", function (event) {
      event.preventDefault();
      setStoredLanguage(linkLang);
      applyLanguage(linkLang);
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
      setLanguageDropdownState(false);
    });
  });

  var languageRoot = document.getElementById("lang-switch");
  var languageTrigger = document.getElementById("lang-trigger");
  if (languageRoot && languageTrigger) {
    languageTrigger.addEventListener("click", function () {
      var isOpen = languageRoot.classList.contains("open");
      setLanguageDropdownState(!isOpen);
    });

    document.addEventListener("click", function (event) {
      if (!languageRoot.contains(event.target)) {
        setLanguageDropdownState(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setLanguageDropdownState(false);
      }
    });
  }
})();
