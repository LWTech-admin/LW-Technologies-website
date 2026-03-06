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
    var modeIconSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4A8 8 0 0 0 12 20L12 4Z" style="fill:#ffffff;stroke:none"></path><circle cx="12" cy="12" r="8"></circle><path d="M12 4v16"></path></svg>';
    if (normalizedMode === "light") {
      modeIconSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.2" style="fill:#ff8a3d;stroke:#ff8a3d"></circle><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" style="stroke:#ff8a3d"></path></svg>';
    }
    if (normalizedMode === "dark") {
      modeIconSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.6 14.3A8.5 8.5 0 1 1 9.7 3.4a7.1 7.1 0 1 0 10.9 10.9z" style="fill:#ffd34d;stroke:#ffd34d"></path></svg>';
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
    title: "LW Technologies | Engineering Consulting in Robotics, Electronics & Mechanical Design",
    description: "LW Technologies is a Geneva, Switzerland engineering consultancy specialized in robotics, mechatronics, electronics, and mechanical design, with expertise in medical technology, railway, and space engineering.",
    ogLocale: "en_CH",
    ogTitle: "LW Technologies | Engineering Consulting in Robotics, Electronics & Mechanical Design",
    ogDescription: "Engineering consulting in robotics, mechatronics, electronics, and mechanical design in Geneva, Switzerland.",
    twitterTitle: "LW Technologies | Engineering Consulting in Robotics, Electronics & Mechanical Design",
    twitterDescription: "Engineering consulting in robotics, mechatronics, electronics, and mechanical design in Geneva, Switzerland.",
    navAbout: "About",
    navServices: "Services",
    navWork: "Projects",
    navContact: "Contact",
    heroPill: "Engineering on Demand",
    heroTitle: "Custom Robotics, Electronics & Mechanical Design.",
    heroDesc: "From Geneva, 🇨🇭 Switzerland, LW Technologies delivers precision engineering by combining mechatronics, embedded electronics, and mechanical design for industrial, product development, and research applications.",
    heroCtaPrimary: "Start a Project",
    heroCtaSecondary: "View Our Work",
    capPill: "Capabilities",
    stat1Title: "Robotics",
    stat1Desc: "Autonomous and mechatronic systems",
    stat2Title: "Electronics",
    stat2Desc: "Custom PCB layouts, drivers, and embedded control",
    stat3Title: "Mechanical",
    stat3Desc: "Custom mechanical designs",
    stat4Title: "Cross-Sector",
    stat4Desc: "Industrial, Medical, Railway, and Space engineering",
    aboutPill: "About",
    aboutTitle: "Built for complex engineering challenges.",
    aboutDesc: "Based in Geneva, Switzerland, LW Technologies draws on its background in industrial, medical, railway, and space engineering to deliver innovative, tailor-made solutions. From product development to specialized systems for industry and research, each engagement is designed around your technical and operational requirements.",
    industryNote: "Clarification: LW Technologies is an engineering consulting company and does not provide locksmith services. If third-party directory listings (including moneyhouse.ch) differ, this official website is the source of truth.",
    proofPill: "Proof",
    proofTitle: "Why technical teams trust LW Technologies.",
    proof1Title: "[PLACEHOLDER: YEARS OF EXPERIENCE]",
    proof1Desc: "Years delivering engineering projects in high-reliability environments.",
    proof2Title: "[PLACEHOLDER: PROJECTS DELIVERED]",
    proof2Desc: "Completed projects from prototyping to production transfer.",
    proof3Title: "Industrial • Medical • Railway • Space",
    proof3Desc: "Cross-sector engineering know-how applied to demanding constraints.",
    proof4Title: "[PLACEHOLDER: RESPONSE TIME]",
    proof4Desc: "Typical response time for first technical discussion.",
    servicesPill: "Services",
    servicesTitle: "Core expertise and execution.",
    service1Title: "Robotic & Mechatronic Systems",
    service1Desc: "Development of custom robotic and mechatronic solutions, from concept and prototyping to integration and deployment.",
    service2Title: "Electronics Design",
    service2Desc: "Design and development of electronic hardware, including PCB layouts, embedded systems, and control software tailored to your requirements.",
    service3Title: "Mechanical Design",
    service3Desc: "Engineering of structures, components, and systems with a focus on functionality, manufacturability, and durability using modern CAD and simulation tools.",
    serviceLinkLabel: "Learn more",
    processPill: "Process",
    processTitle: "A clear delivery process from scope to production.",
    process1Title: "1) Scope",
    process1Desc: "Define requirements, constraints, interfaces, and success criteria.",
    process2Title: "2) Design",
    process2Desc: "Develop architecture and detailed design for mechanics, electronics, and control.",
    process3Title: "3) Prototype",
    process3Desc: "Build, test, and iterate with measurable performance targets.",
    process4Title: "4) Transfer",
    process4Desc: "Deliver documentation and support transfer to industrialization or internal teams.",
    projectsPill: "Projects",
    projectsTitle: "Previous Work",
    project1Title: "Autonomous Vision System",
    project1Desc: "Problem: [PLACEHOLDER: CLIENT NEED]. Solution: Visual-SLAM and path planning for mobile inspection robots. Result: [PLACEHOLDER: MEASURABLE OUTCOME].",
    project1Media: "Video: [PLACEHOLDER: LINK TO 20–40s DEMO VIDEO]",
    project2Title: "Custom BLDC Servo Drivers",
    project2Desc: "Problem: [PLACEHOLDER: CLIENT NEED]. Solution: Custom BLDC servo drivers with precise torque, speed, and position control. Result: [PLACEHOLDER: MEASURABLE OUTCOME].",
    project2Media: "Video: [PLACEHOLDER: LINK TO 20–40s DEMO VIDEO]",
    project3Title: "Medical Mechanical System",
    project3Desc: "Problem: [PLACEHOLDER: CLIENT NEED]. Solution: Custom 15-ton medical mechanical structure for radiotherapy actuation. Result: [PLACEHOLDER: MEASURABLE OUTCOME].",
    project3Media: "Video: [PLACEHOLDER: LINK TO 20–40s DEMO VIDEO]",
    testimonialsPill: "References",
    testimonialsTitle: "What clients say.",
    testimonial1Quote: "“[PLACEHOLDER: SHORT CLIENT QUOTE ON DELIVERY QUALITY AND TECHNICAL RIGOR.]”",
    testimonial1Meta: "[PLACEHOLDER: NAME, ROLE, COMPANY]",
    testimonial2Quote: "“[PLACEHOLDER: SHORT CLIENT QUOTE ON COLLABORATION SPEED OR SYSTEM PERFORMANCE.]”",
    testimonial2Meta: "[PLACEHOLDER: NAME, ROLE, COMPANY]",
    testimonial3Quote: "[PLACEHOLDER: CLIENT LOGO SLOT OR CERTIFICATION BADGE]",
    testimonial3Meta: "[PLACEHOLDER: OPTIONAL BRAND NAME]",
    testimonial4Quote: "[PLACEHOLDER: CLIENT LOGO SLOT OR CERTIFICATION BADGE]",
    testimonial4Meta: "[PLACEHOLDER: OPTIONAL BRAND NAME]",
    faqPill: "FAQ",
    faqTitle: "Answers to common project questions.",
    faqQ1: "What information should I provide to start a project?",
    faqA1: "Share your objective, constraints, target timeline, budget range, and available technical documentation. [PLACEHOLDER: ADD YOUR IDEAL FIRST-CALL CHECKLIST]",
    faqQ2: "Can you support only one discipline (mechanical, electronics, or robotics)?",
    faqA2: "Yes. Engagements can cover a full mechatronic system or a focused technical scope.",
    faqQ3: "Do you provide documentation for certification and handover?",
    faqA3: "Yes. Project outputs can include design files, test reports, BOMs, and integration notes. [PLACEHOLDER: LIST YOUR STANDARD DELIVERABLES]",
    faqQ4: "Can you work with existing suppliers or internal teams?",
    faqA4: "Yes. LW Technologies can collaborate with your internal engineering team and external partners for efficient delivery.",
    logoAlt: "LW Technologies logo",
    project1Alt: "Autonomous machine vision system with Visual-SLAM and path planning",
    project2Alt: "Custom BLDC servo motor driver electronics",
    project3Alt: "Custom medical mechanical system for radiotherapy",
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
    contactBookCall: "Book a 30-min Technical Call",
    privacyPill: "Privacy",
    privacyTitle: "Privacy & Analytics",
    privacyDesc: "This website uses Google Analytics to measure traffic, such as visits, pages viewed, device type (mobile/desktop), browser, and approximate location (city/country).",
    privacyOwner: "Analytics reports are accessible only to the website owner through a protected Google account. No direct personal contact information is collected through analytics alone.",
    privacyLink: "Privacy & Analytics",
    consentText: "We use analytics cookies only with your consent. See our",
    consentPolicyLink: "Privacy Policy",
    consentAccept: "Accept cookies",
    consentReject: "Reject",
    footerCopy: "© 2026 LW Technologies Sàrl | All rights reserved",
    themeModeLabel: "Theme mode",
    themeAuto: "AUTO",
    themeLight: "LIGHT",
    themeDark: "DARK"
  },

  fr: {
    navAria: "Navigation principale",
    title: "LW Technologies | Conseil en ingénierie en robotique, électronique et conception mécanique",
    description: "LW Technologies est une société de conseil en ingénierie basée à Genève, Suisse, spécialisée en robotique, mécatronique, électronique et conception mécanique, avec une expertise dans les secteurs médical, ferroviaire et spatial.",
    ogLocale: "fr_CH",
    ogTitle: "LW Technologies | Conseil en ingénierie en robotique, électronique et conception mécanique",
    ogDescription: "Conseil en ingénierie en robotique, mécatronique, électronique et conception mécanique à Genève, Suisse.",
    twitterTitle: "LW Technologies | Conseil en ingénierie en robotique, électronique et conception mécanique",
    twitterDescription: "Conseil en ingénierie en robotique, mécatronique, électronique et conception mécanique à Genève, Suisse.",
    navAbout: "À propos",
    navServices: "Services",
    navWork: "Projets",
    navContact: "Contact",
    heroPill: "Ingénierie sur demande",
    heroTitle: "Robotique, électronique et conception mécanique sur mesure.",
    heroDesc: "Depuis Genève, 🇨🇭 Suisse, LW Technologies fournit une ingénierie de précision en combinant mécatronique, électronique embarquée et conception mécanique pour des applications industrielles, le développement de produits et la recherche.",
    heroCtaPrimary: "Démarrer un projet",
    heroCtaSecondary: "Voir nos réalisations",
    capPill: "Compétences",
    stat1Title: "Robotique",
    stat1Desc: "Systèmes autonomes et mécatroniques",
    stat2Title: "Électronique",
    stat2Desc: "PCB sur mesure, drivers et contrôle embarqué",
    stat3Title: "Mécanique",
    stat3Desc: "Conceptions mécaniques sur mesure",
    stat4Title: "Multi-secteurs",
    stat4Desc: "Industrie, médical, ferroviaire et spatial",
    aboutPill: "À propos",
    aboutTitle: "Conçu pour les défis d’ingénierie complexes.",
    aboutDesc: "Basée à Genève, Suisse, LW Technologies s’appuie sur son expérience en ingénierie industrielle, médicale, ferroviaire et spatiale pour proposer des solutions innovantes et sur mesure. Du développement produit aux systèmes spécialisés pour l’industrie et la recherche, chaque mission est conçue selon vos exigences techniques et opérationnelles.",
    industryNote: "Clarification : LW Technologies est une société de conseil en ingénierie et ne fournit pas de services de serrurerie. En cas d’informations différentes sur des annuaires tiers (y compris moneyhouse.ch), ce site officiel fait foi.",
    proofPill: "Preuves",
    proofTitle: "Pourquoi les équipes techniques font confiance à LW Technologies.",
    proof1Title: "[PLACEHOLDER: ANNÉES D’EXPÉRIENCE]",
    proof1Desc: "Années de projets d’ingénierie livrés en environnements à haute fiabilité.",
    proof2Title: "[PLACEHOLDER: PROJETS LIVRÉS]",
    proof2Desc: "Projets réalisés du prototype au transfert en production.",
    proof3Title: "Industrie • Médical • Ferroviaire • Spatial",
    proof3Desc: "Compétences multi-secteurs appliquées à des contraintes exigeantes.",
    proof4Title: "[PLACEHOLDER: DÉLAI DE RÉPONSE]",
    proof4Desc: "Délai moyen pour un premier échange technique.",
    servicesPill: "Services",
    servicesTitle: "Expertise clé et maîtrise opérationnelle.",
    service1Title: "Systèmes robotiques et mécatroniques",
    service1Desc: "Développement de solutions robotiques et mécatroniques sur mesure, du concept et prototypage jusqu’à l’intégration et au déploiement.",
    service2Title: "Conception électronique",
    service2Desc: "Conception et développement de matériel électronique, incluant PCB, systèmes embarqués et logiciels de contrôle adaptés à vos besoins.",
    service3Title: "Conception mécanique",
    service3Desc: "Ingénierie de structures, composants et systèmes avec un focus sur la fonctionnalité, la fabricabilité et la durabilité à l’aide d’outils CAD et de simulation modernes.",
    serviceLinkLabel: "En savoir plus",
    processPill: "Processus",
    processTitle: "Un processus clair, du cadrage à la production.",
    process1Title: "1) Cadrage",
    process1Desc: "Définition des exigences, contraintes, interfaces et critères de succès.",
    process2Title: "2) Conception",
    process2Desc: "Architecture et conception détaillée en mécanique, électronique et contrôle.",
    process3Title: "3) Prototype",
    process3Desc: "Réalisation, tests et itérations avec objectifs mesurables.",
    process4Title: "4) Transfert",
    process4Desc: "Livraison de la documentation et support au transfert vers l’industrialisation ou vos équipes internes.",
    projectsPill: "Projets",
    projectsTitle: "Réalisations précédentes",
    project1Title: "Système de vision autonome",
    project1Desc: "Problème : [PLACEHOLDER: BESOIN CLIENT]. Solution : Visual-SLAM et planification de trajectoire pour robots d’inspection mobiles. Résultat : [PLACEHOLDER: RÉSULTAT MESURABLE].",
    project1Media: "Vidéo : [PLACEHOLDER: LIEN VERS DÉMO 20–40s]",
    project2Title: "Drivers servo BLDC sur mesure",
    project2Desc: "Problème : [PLACEHOLDER: BESOIN CLIENT]. Solution : drivers servo BLDC sur mesure avec contrôle précis du couple, de la vitesse et de la position. Résultat : [PLACEHOLDER: RÉSULTAT MESURABLE].",
    project2Media: "Vidéo : [PLACEHOLDER: LIEN VERS DÉMO 20–40s]",
    project3Title: "Système mécanique médical",
    project3Desc: "Problème : [PLACEHOLDER: BESOIN CLIENT]. Solution : structure mécanique médicale sur mesure de 15 tonnes pour actionnement de radiothérapie. Résultat : [PLACEHOLDER: RÉSULTAT MESURABLE].",
    project3Media: "Vidéo : [PLACEHOLDER: LIEN VERS DÉMO 20–40s]",
    testimonialsPill: "Références",
    testimonialsTitle: "Ce que disent les clients.",
    testimonial1Quote: "« [PLACEHOLDER: COURT AVIS CLIENT SUR LA QUALITÉ DE LIVRAISON ET LA RIGUEUR TECHNIQUE.] »",
    testimonial1Meta: "[PLACEHOLDER: NOM, FONCTION, ENTREPRISE]",
    testimonial2Quote: "« [PLACEHOLDER: COURT AVIS CLIENT SUR LA VITESSE DE COLLABORATION OU LA PERFORMANCE SYSTÈME.] »",
    testimonial2Meta: "[PLACEHOLDER: NOM, FONCTION, ENTREPRISE]",
    testimonial3Quote: "[PLACEHOLDER: LOGO CLIENT OU CERTIFICATION]",
    testimonial3Meta: "[PLACEHOLDER: NOM DE MARQUE OPTIONNEL]",
    testimonial4Quote: "[PLACEHOLDER: LOGO CLIENT OU CERTIFICATION]",
    testimonial4Meta: "[PLACEHOLDER: NOM DE MARQUE OPTIONNEL]",
    faqPill: "FAQ",
    faqTitle: "Réponses aux questions fréquentes.",
    faqQ1: "Quelles informations fournir pour démarrer un projet ?",
    faqA1: "Partagez votre objectif, vos contraintes, votre délai cible, votre budget indicatif et la documentation technique disponible. [PLACEHOLDER: AJOUTEZ VOTRE CHECKLIST D’APPEL INITIAL]",
    faqQ2: "Pouvez-vous intervenir sur une seule discipline (mécanique, électronique ou robotique) ?",
    faqA2: "Oui. Les missions peuvent couvrir un système mécatronique complet ou un périmètre technique ciblé.",
    faqQ3: "Fournissez-vous la documentation pour certification et transfert ?",
    faqA3: "Oui. Les livrables peuvent inclure fichiers de conception, rapports de test, nomenclatures et notes d’intégration. [PLACEHOLDER: LISTEZ VOS LIVRABLES STANDARD]",
    faqQ4: "Pouvez-vous collaborer avec nos fournisseurs ou nos équipes internes ?",
    faqA4: "Oui. LW Technologies peut travailler avec vos équipes et partenaires externes pour une livraison efficace.",
    logoAlt: "Logo LW Technologies",
    project1Alt: "Système de vision autonome avec Visual-SLAM et planification de trajectoire",
    project2Alt: "Électronique de commande servo BLDC sur mesure",
    project3Alt: "Système mécanique médical sur mesure pour radiothérapie",
    contactPill: "Contact",
    contactTitle: "Construisons votre prochain système.",
    contactDesc: "Pour toute demande de projet, utilisez le formulaire ou contactez-nous directement.",
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
    contactBookCall: "Réserver un appel technique de 30 min",
    privacyPill: "Confidentialité",
    privacyTitle: "Confidentialité et analyses",
    privacyDesc: "Ce site utilise Google Analytics pour mesurer le trafic, notamment les visites, les pages consultées, le type d’appareil (mobile/ordinateur), le navigateur et la localisation approximative (ville/pays).",
    privacyOwner: "Les rapports d’analyse sont accessibles uniquement au propriétaire du site via un compte Google protégé. Aucune information de contact personnelle directe n’est collectée par l’analyse seule.",
    privacyLink: "Confidentialité et analyses",
    consentText: "Nous utilisons des cookies d’analyse uniquement avec votre consentement. Voir notre",
    consentPolicyLink: "Politique de confidentialité",
    consentAccept: "Accepter les cookies",
    consentReject: "Refuser",
    footerCopy: "© 2026 LW Technologies Sàrl | Tous droits réservés",
    themeModeLabel: "Mode d’affichage",
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
    heroTitle: "Robotica, elettronica e progettazione meccanica su misura.",
    heroDesc: "Da Ginevra, 🇨🇭 Svizzera, LW Technologies offre ingegneria di precisione combinando meccatronica, elettronica embedded e progettazione meccanica per applicazioni industriali, sviluppo prodotto e ricerca.",
    heroCtaPrimary: "Avvia un progetto",
    heroCtaSecondary: "Scopri i nostri progetti",
    capPill: "Competenze",
    stat1Title: "Robotica",
    stat1Desc: "Sistemi autonomi e meccatronici",
    stat2Title: "Elettronica",
    stat2Desc: "PCB su misura, driver e controllo embedded",
    stat3Title: "Meccanica",
    stat3Desc: "Progettazioni meccaniche su misura",
    stat4Title: "Multi-settore",
    stat4Desc: "Industriale, medicale, ferroviario e spaziale",
    aboutPill: "Chi siamo",
    aboutTitle: "Progettato per affrontare sfide ingegneristiche complesse.",
    aboutDesc: "Con sede a Ginevra, Svizzera, LW Technologies valorizza la propria esperienza nell’ingegneria industriale, medicale, ferroviaria e spaziale per offrire soluzioni innovative e su misura. Dallo sviluppo prodotto ai sistemi specializzati per industria e ricerca, ogni incarico è definito in base alle vostre esigenze tecniche e operative.",
    industryNote: "Chiarimento: LW Technologies è una società di consulenza ingegneristica e non fornisce servizi di fabbro. Se le informazioni presenti su directory di terze parti (incluso moneyhouse.ch) differiscono, questo sito ufficiale costituisce la fonte di riferimento.",
    proofPill: "Prove",
    proofTitle: "Perché i team tecnici scelgono LW Technologies.",
    proof1Title: "[PLACEHOLDER: ANNI DI ESPERIENZA]",
    proof1Desc: "Anni di progetti ingegneristici in ambienti ad alta affidabilità.",
    proof2Title: "[PLACEHOLDER: PROGETTI CONSEGNATI]",
    proof2Desc: "Progetti completati dal prototipo al trasferimento in produzione.",
    proof3Title: "Industriale • Medicale • Ferroviario • Spaziale",
    proof3Desc: "Competenze cross-settore applicate a vincoli complessi.",
    proof4Title: "[PLACEHOLDER: TEMPO DI RISPOSTA]",
    proof4Desc: "Tempo medio di risposta per un primo confronto tecnico.",
    servicesPill: "Servizi",
    servicesTitle: "Competenze chiave ed esecuzione tecnica.",
    service1Title: "Sistemi robotici e meccatronici",
    service1Desc: "Sviluppo di soluzioni robotiche e meccatroniche personalizzate, dal concept e prototipazione fino all’integrazione e al deployment.",
    service2Title: "Progettazione elettronica",
    service2Desc: "Progettazione e sviluppo di hardware elettronico, inclusi layout PCB, sistemi embedded e software di controllo su misura.",
    service3Title: "Progettazione meccanica",
    service3Desc: "Ingegneria di strutture, componenti e sistemi con focus su funzionalità, producibilità e durabilità, supportata da strumenti CAD e simulazione moderni.",
    serviceLinkLabel: "Scopri di più",
    processPill: "Processo",
    processTitle: "Un processo chiaro, dallo scope alla produzione.",
    process1Title: "1) Scope",
    process1Desc: "Definizione di requisiti, vincoli, interfacce e criteri di successo.",
    process2Title: "2) Design",
    process2Desc: "Architettura e progettazione dettagliata per meccanica, elettronica e controllo.",
    process3Title: "3) Prototipo",
    process3Desc: "Realizzazione, test e iterazioni con obiettivi misurabili.",
    process4Title: "4) Trasferimento",
    process4Desc: "Consegna documentazione e supporto al trasferimento verso industrializzazione o team interni.",
    projectsPill: "Progetti",
    projectsTitle: "Progetti realizzati",
    project1Title: "Sistema di visione autonoma",
    project1Desc: "Problema: [PLACEHOLDER: ESIGENZA CLIENTE]. Soluzione: Visual-SLAM e pianificazione del percorso per robot mobili di ispezione. Risultato: [PLACEHOLDER: RISULTATO MISURABILE].",
    project1Media: "Video: [PLACEHOLDER: LINK A DEMO 20–40s]",
    project2Title: "Driver servo BLDC personalizzati",
    project2Desc: "Problema: [PLACEHOLDER: ESIGENZA CLIENTE]. Soluzione: driver servo BLDC personalizzati con controllo preciso di coppia, velocità e posizione. Risultato: [PLACEHOLDER: RISULTATO MISURABILE].",
    project2Media: "Video: [PLACEHOLDER: LINK A DEMO 20–40s]",
    project3Title: "Sistema meccanico medicale",
    project3Desc: "Problema: [PLACEHOLDER: ESIGENZA CLIENTE]. Soluzione: struttura meccanica medicale personalizzata da 15 tonnellate per attuazione radioterapica. Risultato: [PLACEHOLDER: RISULTATO MISURABILE].",
    project3Media: "Video: [PLACEHOLDER: LINK A DEMO 20–40s]",
    testimonialsPill: "Referenze",
    testimonialsTitle: "Cosa dicono i clienti.",
    testimonial1Quote: "“[PLACEHOLDER: BREVE TESTIMONIANZA CLIENTE SU QUALITÀ DI CONSEGNA E RIGORE TECNICO.]”",
    testimonial1Meta: "[PLACEHOLDER: NOME, RUOLO, AZIENDA]",
    testimonial2Quote: "“[PLACEHOLDER: BREVE TESTIMONIANZA CLIENTE SU VELOCITÀ DI COLLABORAZIONE O PRESTAZIONI DEL SISTEMA.]”",
    testimonial2Meta: "[PLACEHOLDER: NOME, RUOLO, AZIENDA]",
    testimonial3Quote: "[PLACEHOLDER: SLOT LOGO CLIENTE O CERTIFICAZIONE]",
    testimonial3Meta: "[PLACEHOLDER: NOME BRAND OPZIONALE]",
    testimonial4Quote: "[PLACEHOLDER: SLOT LOGO CLIENTE O CERTIFICAZIONE]",
    testimonial4Meta: "[PLACEHOLDER: NOME BRAND OPZIONALE]",
    faqPill: "FAQ",
    faqTitle: "Risposte alle domande più comuni.",
    faqQ1: "Quali informazioni devo fornire per avviare un progetto?",
    faqA1: "Condividi obiettivo, vincoli, timeline target, fascia di budget e documentazione tecnica disponibile. [PLACEHOLDER: AGGIUNGI LA TUA CHECKLIST DELLA PRIMA CALL]",
    faqQ2: "Potete seguire una sola disciplina (meccanica, elettronica o robotica)?",
    faqA2: "Sì. Gli incarichi possono coprire un sistema meccatronico completo o uno scope tecnico specifico.",
    faqQ3: "Fornite documentazione per certificazione e handover?",
    faqA3: "Sì. I deliverable possono includere file di progetto, report di test, BOM e note di integrazione. [PLACEHOLDER: ELENCA I DELIVERABLE STANDARD]",
    faqQ4: "Potete lavorare con fornitori esistenti o team interni?",
    faqA4: "Sì. LW Technologies può collaborare con il tuo team interno e partner esterni per una consegna efficiente.",
    logoAlt: "Logo LW Technologies",
    project1Alt: "Sistema di visione autonoma con Visual-SLAM e pianificazione del percorso",
    project2Alt: "Elettronica driver servo BLDC personalizzata",
    project3Alt: "Sistema meccanico medicale personalizzato per radioterapia",
    contactPill: "Contatti",
    contactTitle: "Costruiamo il tuo prossimo sistema.",
    contactDesc: "Per richieste di progetto, utilizza il modulo oppure contattaci direttamente.",
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
    contactBookCall: "Prenota una call tecnica di 30 min",
    privacyPill: "Privacy",
    privacyTitle: "Privacy e analisi",
    privacyDesc: "Questo sito utilizza Google Analytics per misurare il traffico, come visite, pagine visualizzate, tipo di dispositivo (mobile/desktop), browser e posizione approssimativa (città/paese).",
    privacyOwner: "I report di analisi sono accessibili solo al proprietario del sito tramite un account Google protetto. I soli dati di analisi non raccolgono informazioni di contatto personali dirette.",
    privacyLink: "Privacy e analisi",
    consentText: "Utilizziamo cookie di analisi solo con il tuo consenso. Consulta la nostra",
    consentPolicyLink: "Informativa sulla privacy",
    consentAccept: "Accetta i cookie",
    consentReject: "Rifiuta",
    footerCopy: "© 2026 LW Technologies Sàrl | Tutti i diritti riservati",
    themeModeLabel: "Modalità tema",
    themeAuto: "AUTO",
    themeLight: "CHIARO",
    themeDark: "SCURO"
  },

  de: {
    navAria: "Hauptnavigation",
    title: "LW Technologies | Engineering Beratung in Robotik, Elektronik und mechanischer Konstruktion",
    description: "LW Technologies ist ein Engineering Beratungsunternehmen mit Sitz in Genf, Schweiz, spezialisiert auf Robotik, Mechatronik, Elektronik und mechanische Konstruktion, mit Erfahrung in Medizintechnik, Bahntechnik und Raumfahrt.",
    ogLocale: "de_CH",
    ogTitle: "LW Technologies | Engineering Beratung in Robotik, Elektronik und mechanischer Konstruktion",
    ogDescription: "Engineering Beratung in Robotik, Mechatronik, Elektronik und mechanischer Konstruktion in Genf, Schweiz.",
    twitterTitle: "LW Technologies | Engineering Beratung in Robotik, Elektronik und mechanischer Konstruktion",
    twitterDescription: "Engineering Beratung in Robotik, Mechatronik, Elektronik und mechanischer Konstruktion in Genf, Schweiz.",
    navAbout: "Über uns",
    navServices: "Leistungen",
    navWork: "Projekte",
    navContact: "Kontakt",
    heroPill: "Engineering auf Abruf",
    heroTitle: "Robotik, Elektronik und mechanische Konstruktion nach Maß.",
    heroDesc: "Von Genf, 🇨🇭 Schweiz aus liefert LW Technologies präzises Engineering durch die Kombination von Mechatronik, Embedded-Elektronik und mechanischer Konstruktion für industrielle Anwendungen, Produktentwicklung und Forschung.",
    heroCtaPrimary: "Projekt starten",
    heroCtaSecondary: "Unsere Projekte ansehen",
    capPill: "Kompetenzen",
    stat1Title: "Robotik",
    stat1Desc: "Autonome und mechatronische Systeme",
    stat2Title: "Elektronik",
    stat2Desc: "Individuelle PCB Layouts, Treiber und Embedded Steuerungen",
    stat3Title: "Mechanik",
    stat3Desc: "Mechanische Konstruktionen nach Maß",
    stat4Title: "Branchen-übergreifend",
    stat4Desc: "Industrie, Medizintechnik, Bahn und Raumfahrt",
    aboutPill: "Über uns",
    aboutTitle: "Entwickelt für komplexe technische Herausforderungen.",
    aboutDesc: "Mit Sitz in Genf, Schweiz, nutzt LW Technologies seine Erfahrung im Industrie, Medizin, Bahn und Raumfahrtingenieurwesen, um innovative und maßgeschneiderte Lösungen zu liefern. Von der Produktentwicklung bis zu spezialisierten Systemen für Industrie und Forschung wird jedes Projekt auf Ihre technischen und operativen Anforderungen abgestimmt.",
    industryNote: "Klarstellung: LW Technologies ist ein Engineering Beratungsunternehmen und bietet keine Schlüsseldienstleistungen an. Wenn Angaben in Verzeichnissen von Drittanbietern (einschließlich moneyhouse.ch) abweichen, ist diese offizielle Website die maßgebliche Quelle.",
    proofPill: "Nachweise",
    proofTitle: "Warum technische Teams LW Technologies vertrauen.",
    proof1Title: "[PLACEHOLDER: JAHRE ERFAHRUNG]",
    proof1Desc: "Jahre erfolgreicher Engineering-Projekte in hochzuverlässigen Umgebungen.",
    proof2Title: "[PLACEHOLDER: ABGESCHLOSSENE PROJEKTE]",
    proof2Desc: "Abgeschlossene Projekte vom Prototyp bis zum Produktionsübergang.",
    proof3Title: "Industrie • Medizin • Bahn • Raumfahrt",
    proof3Desc: "Branchenübergreifendes Know-how für anspruchsvolle Anforderungen.",
    proof4Title: "[PLACEHOLDER: REAKTIONSZEIT]",
    proof4Desc: "Typische Reaktionszeit für ein erstes technisches Gespräch.",
    servicesPill: "Leistungen",
    servicesTitle: "Kernkompetenzen und Umsetzung.",
    service1Title: "Robotik und mechatronische Systeme",
    service1Desc: "Entwicklung kundenspezifischer Robotik und Mechatroniklösungen von der Konzeptphase und dem Prototyping bis zur Integration und Implementierung.",
    service2Title: "Elektronikentwicklung",
    service2Desc: "Entwicklung elektronischer Hardware inklusive PCB Layouts, Embedded Systemen und maßgeschneiderter Steuerungssoftware.",
    service3Title: "Mechanische Konstruktion",
    service3Desc: "Engineering von Strukturen, Komponenten und Systemen mit Fokus auf Funktionalität, Fertigbarkeit und Langlebigkeit, unterstützt durch moderne CAD und Simulationswerkzeuge.",
    serviceLinkLabel: "Mehr erfahren",
    processPill: "Prozess",
    processTitle: "Ein klarer Ablauf von Scope bis Produktion.",
    process1Title: "1) Scope",
    process1Desc: "Definition von Anforderungen, Randbedingungen, Schnittstellen und Erfolgskriterien.",
    process2Title: "2) Design",
    process2Desc: "Architektur und Detaildesign für Mechanik, Elektronik und Regelung.",
    process3Title: "3) Prototyp",
    process3Desc: "Aufbau, Tests und Iterationen mit messbaren Leistungszielen.",
    process4Title: "4) Transfer",
    process4Desc: "Dokumentation liefern und Übergang zur Industrialisierung oder zu internen Teams begleiten.",
    projectsPill: "Projekte",
    projectsTitle: "Referenzprojekte",
    project1Title: "Autonomes Vision System",
    project1Desc: "Problem: [PLACEHOLDER: KUNDENBEDARF]. Lösung: Visual-SLAM und Pfadplanung für mobile Inspektionsroboter. Ergebnis: [PLACEHOLDER: MESSBARES ERGEBNIS].",
    project1Media: "Video: [PLACEHOLDER: LINK ZU 20–40s DEMO]",
    project2Title: "Kundenspezifische BLDC Servotreiber",
    project2Desc: "Problem: [PLACEHOLDER: KUNDENBEDARF]. Lösung: kundenspezifische BLDC-Servotreiber mit präziser Drehmoment-, Geschwindigkeits- und Positionsregelung. Ergebnis: [PLACEHOLDER: MESSBARES ERGEBNIS].",
    project2Media: "Video: [PLACEHOLDER: LINK ZU 20–40s DEMO]",
    project3Title: "Medizinisches mechanisches System",
    project3Desc: "Problem: [PLACEHOLDER: KUNDENBEDARF]. Lösung: kundenspezifische 15-Tonnen-Struktur für radiotherapeutische Aktuation. Ergebnis: [PLACEHOLDER: MESSBARES ERGEBNIS].",
    project3Media: "Video: [PLACEHOLDER: LINK ZU 20–40s DEMO]",
    testimonialsPill: "Referenzen",
    testimonialsTitle: "Was Kunden sagen.",
    testimonial1Quote: "„[PLACEHOLDER: KURZES KUNDENZITAT ZU LIEFERQUALITÄT UND TECHNISCHER SORGFALT.]“",
    testimonial1Meta: "[PLACEHOLDER: NAME, ROLLE, UNTERNEHMEN]",
    testimonial2Quote: "„[PLACEHOLDER: KURZES KUNDENZITAT ZU ZUSAMMENARBEITSGESCHWINDIGKEIT ODER SYSTEMLEISTUNG.]“",
    testimonial2Meta: "[PLACEHOLDER: NAME, ROLLE, UNTERNEHMEN]",
    testimonial3Quote: "[PLACEHOLDER: KUNDENLOGO ODER ZERTIFIZIERUNG]",
    testimonial3Meta: "[PLACEHOLDER: OPTIONALER MARKENNAME]",
    testimonial4Quote: "[PLACEHOLDER: KUNDENLOGO ODER ZERTIFIZIERUNG]",
    testimonial4Meta: "[PLACEHOLDER: OPTIONALER MARKENNAME]",
    faqPill: "FAQ",
    faqTitle: "Antworten auf häufige Projektfragen.",
    faqQ1: "Welche Informationen sollte ich für den Projektstart bereitstellen?",
    faqA1: "Teilen Sie Ziel, Randbedingungen, Zeitplan, Budgetrahmen und verfügbare technische Unterlagen. [PLACEHOLDER: ERGÄNZEN SIE IHRE IDEALE ERSTGESPRÄCH-CHECKLISTE]",
    faqQ2: "Können Sie auch nur eine Disziplin übernehmen (Mechanik, Elektronik oder Robotik)?",
    faqA2: "Ja. Projekte können ein komplettes mechatronisches System oder einen fokussierten technischen Umfang abdecken.",
    faqQ3: "Liefern Sie Dokumentation für Zertifizierung und Übergabe?",
    faqA3: "Ja. Projektergebnisse können Konstruktionsdaten, Testberichte, Stücklisten und Integrationshinweise enthalten. [PLACEHOLDER: IHRE STANDARD-LIEFEROBJEKTE AUFLISTEN]",
    faqQ4: "Können Sie mit bestehenden Lieferanten oder internen Teams arbeiten?",
    faqA4: "Ja. LW Technologies kann mit Ihrem internen Engineering-Team und externen Partnern effizient zusammenarbeiten.",
    logoAlt: "LW Technologies Logo",
    project1Alt: "Autonomes Vision System mit Visual-SLAM und Pfadplanung",
    project2Alt: "Kundenspezifische BLDC Servotreiber Elektronik",
    project3Alt: "Kundenspezifisches medizinisches mechanisches System für Radiotherapie",
    contactPill: "Kontakt",
    contactTitle: "Lassen Sie uns Ihr nächstes System entwickeln.",
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
    contactBookCall: "30-min technisches Gespräch buchen",
    privacyPill: "Datenschutz",
    privacyTitle: "Datenschutz und Analysen",
    privacyDesc: "Diese Website verwendet Google Analytics zur Messung des Traffics, z. B. Besuche, aufgerufene Seiten, Gerätetyp (Mobil/Desktop), Browser und ungefähren Standort (Stadt/Land).",
    privacyOwner: "Analyseberichte sind nur für den Website-Eigentümer über ein geschütztes Google-Konto zugänglich. Durch die Analyse allein werden keine direkten persönlichen Kontaktdaten erfasst.",
    privacyLink: "Datenschutz und Analysen",
    consentText: "Wir verwenden Analyse-Cookies nur mit Ihrer Einwilligung. Siehe unsere",
    consentPolicyLink: "Datenschutzerklärung",
    consentAccept: "Cookies akzeptieren",
    consentReject: "Ablehnen",
    footerCopy: "© 2026 LW Technologies Sàrl | Alle Rechte vorbehalten",
    themeModeLabel: "Designmodus",
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
    proofPill: "proof-pill",
    proofTitle: "proof-title",
    proof1Title: "proof-1-title",
    proof1Desc: "proof-1-desc",
    proof2Title: "proof-2-title",
    proof2Desc: "proof-2-desc",
    proof3Title: "proof-3-title",
    proof3Desc: "proof-3-desc",
    proof4Title: "proof-4-title",
    proof4Desc: "proof-4-desc",
    servicesPill: "services-pill",
    servicesTitle: "services-title",
    service1Title: "service-1-title",
    service1Desc: "service-1-desc",
    service2Title: "service-2-title",
    service2Desc: "service-2-desc",
    service3Title: "service-3-title",
    service3Desc: "service-3-desc",
    contactBookCall: "contact-book-call",
    processPill: "process-pill",
    processTitle: "process-title",
    process1Title: "process-1-title",
    process1Desc: "process-1-desc",
    process2Title: "process-2-title",
    process2Desc: "process-2-desc",
    process3Title: "process-3-title",
    process3Desc: "process-3-desc",
    process4Title: "process-4-title",
    process4Desc: "process-4-desc",
    projectsPill: "projects-pill",
    projectsTitle: "projects-title",
    project1Title: "project-1-title",
    project1Desc: "project-1-desc",
    project1Media: "project-1-media",
    project2Title: "project-2-title",
    project2Desc: "project-2-desc",
    project2Media: "project-2-media",
    project3Title: "project-3-title",
    project3Desc: "project-3-desc",
    project3Media: "project-3-media",
    testimonialsPill: "testimonials-pill",
    testimonialsTitle: "testimonials-title",
    testimonial1Quote: "testimonial-1-quote",
    testimonial1Meta: "testimonial-1-meta",
    testimonial2Quote: "testimonial-2-quote",
    testimonial2Meta: "testimonial-2-meta",
    testimonial3Quote: "testimonial-3-quote",
    testimonial3Meta: "testimonial-3-meta",
    testimonial4Quote: "testimonial-4-quote",
    testimonial4Meta: "testimonial-4-meta",
    faqPill: "faq-pill",
    faqTitle: "faq-title",
    faqQ1: "faq-q1",
    faqA1: "faq-a1",
    faqQ2: "faq-q2",
    faqA2: "faq-a2",
    faqQ3: "faq-q3",
    faqA3: "faq-a3",
    faqQ4: "faq-q4",
    faqA4: "faq-a4",
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
    privacyPill: "privacy-pill",
    privacyTitle: "privacy-title",
    privacyDesc: "privacy-desc",
    privacyOwner: "privacy-owner",
    privacyLink: "privacy-link",
    consentText: "consent-text",
    consentPolicyLink: "consent-policy-link",
    consentAccept: "consent-accept",
    consentReject: "consent-reject",
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

    if (current.serviceLinkLabel) {
      setTextById("service-1-link", current.serviceLinkLabel);
      setTextById("service-2-link", current.serviceLinkLabel);
      setTextById("service-3-link", current.serviceLinkLabel);
    }

    setAttributeById("service-1-link", "href", "robotics-engineering-geneva.html?lang=" + selected);
    setAttributeById("service-2-link", "href", "electronics-design-geneva.html?lang=" + selected);
    setAttributeById("service-3-link", "href", "mechanical-design-geneva.html?lang=" + selected);

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
