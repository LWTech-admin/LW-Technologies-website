(function () {
  var LANG_STORAGE_KEY = "lwtech_lang";
  var THEME_STORAGE_KEY = "lwtech_theme";
  var CONSENT_STORAGE_KEY = "lwtech_analytics_consent";
  var BASE_URL = "https://lwtechnologies.ch/";
  var LANGUAGES = ["en", "fr", "it", "de"];

  var translations = window.LWTECH_I18N || { en: {} };
  var currentLanguage = "en";
  var themeMode = "auto";

  // ---------- Storage ----------

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      return;
    }
  }

  // ---------- Language ----------

  function normalizeLanguage(lang) {
    lang = String(lang || "").toLowerCase().slice(0, 2);
    return LANGUAGES.indexOf(lang) !== -1 ? lang : "en";
  }

  function detectLanguageFromBrowser() {
    var candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < candidates.length; i++) {
      var lang = String(candidates[i] || "").toLowerCase().slice(0, 2);
      if (LANGUAGES.indexOf(lang) !== -1) {
        return lang;
      }
    }
    return "en";
  }

  function getLanguageFromQuery() {
    try {
      var lang = new URLSearchParams(window.location.search).get("lang");
      return lang ? normalizeLanguage(lang) : null;
    } catch (error) {
      return null;
    }
  }

  function t(key) {
    var dictionary = translations[currentLanguage] || {};
    if (dictionary[key] !== undefined) {
      return dictionary[key];
    }
    var fallback = translations.en || {};
    return fallback[key];
  }

  function setMetaContent(id, value) {
    var node = document.getElementById(id);
    if (node && value !== undefined) {
      node.setAttribute("content", value);
    }
  }

  function updateCanonicalUrl(lang) {
    var url = getLanguageFromQuery() ? BASE_URL + "?lang=" + lang : BASE_URL;
    var canonical = document.getElementById("link-canonical");
    if (canonical) {
      canonical.setAttribute("href", url);
    }
    setMetaContent("meta-og-url", url);
  }

  function applyLanguage(lang) {
    currentLanguage = normalizeLanguage(lang);
    document.documentElement.setAttribute("lang", currentLanguage);
    updateCanonicalUrl(currentLanguage);

    if (t("title")) {
      document.title = t("title");
    }
    setMetaContent("meta-description", t("description"));
    setMetaContent("meta-og-locale", t("ogLocale"));
    setMetaContent("meta-og-title", t("ogTitle"));
    setMetaContent("meta-og-description", t("ogDescription"));
    setMetaContent("meta-og-image-alt", t("logoAlt"));
    setMetaContent("meta-twitter-title", t("twitterTitle"));
    setMetaContent("meta-twitter-description", t("twitterDescription"));
    setMetaContent("meta-twitter-image-alt", t("logoAlt"));

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var value = t(node.getAttribute("data-i18n"));
      if (value !== undefined) {
        node.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (node) {
      node.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length !== 2) {
          return;
        }
        var value = t(parts[1].trim());
        if (value !== undefined) {
          node.setAttribute(parts[0].trim(), value);
        }
      });
    });

    document.querySelectorAll("[data-lang-switch]").forEach(function (link) {
      var active = link.getAttribute("data-lang-switch") === currentLanguage;
      link.classList.toggle("active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    var currentLabel = document.getElementById("lang-current");
    if (currentLabel) {
      currentLabel.textContent = currentLanguage.toUpperCase();
    }

    updateThemeToggle();
    updateMenuToggleLabel();
  }

  // ---------- Theme ----------

  var THEME_ICONS = {
    auto: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"></circle><path d="M12 4a8 8 0 0 0 0 16z" style="fill:currentColor"></path></svg>',
    light: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"></path></svg>',
    dark: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path></svg>'
  };

  function isSystemLightMode() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
  }

  function updateThemeToggle() {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) {
      return;
    }
    var textKey = themeMode === "light" ? "themeLight" : themeMode === "dark" ? "themeDark" : "themeAuto";
    var label = (t("themeModeLabel") || "Theme mode") + ": " + (t(textKey) || themeMode.toUpperCase());
    toggle.innerHTML = THEME_ICONS[themeMode];
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
  }

  function applyThemeMode(mode) {
    themeMode = mode === "light" || mode === "dark" ? mode : "auto";
    var effective = themeMode === "auto" ? (isSystemLightMode() ? "light" : "dark") : themeMode;
    document.documentElement.setAttribute("data-theme", effective);
    updateThemeToggle();
  }

  function initTheme() {
    applyThemeMode(readStorage(THEME_STORAGE_KEY));

    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = themeMode === "auto" ? "light" : themeMode === "light" ? "dark" : "auto";
        writeStorage(THEME_STORAGE_KEY, next === "auto" ? null : next);
        applyThemeMode(next);
      });
    }

    if (window.matchMedia) {
      var media = window.matchMedia("(prefers-color-scheme: light)");
      var onChange = function () {
        if (themeMode === "auto") {
          applyThemeMode("auto");
        }
      };
      if (typeof media.addEventListener === "function") {
        media.addEventListener("change", onChange);
      } else if (typeof media.addListener === "function") {
        media.addListener(onChange);
      }
    }
  }

  // ---------- Language menu ----------

  function initLanguageMenu() {
    var root = document.getElementById("lang-switch");
    var trigger = document.getElementById("lang-trigger");
    if (!root || !trigger) {
      return;
    }
    var items = Array.prototype.slice.call(root.querySelectorAll("[data-lang-switch]"));

    function setOpen(open) {
      root.classList.toggle("open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    trigger.addEventListener("click", function () {
      setOpen(!root.classList.contains("open"));
    });

    items.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var lang = link.getAttribute("data-lang-switch");
        writeStorage(LANG_STORAGE_KEY, lang);
        if (getLanguageFromQuery() && window.history && typeof window.history.replaceState === "function") {
          window.history.replaceState(null, "", "?lang=" + lang + window.location.hash);
        }
        applyLanguage(lang);
        setOpen(false);
        trigger.focus();
      });
    });

    document.addEventListener("click", function (event) {
      if (!root.contains(event.target)) {
        setOpen(false);
      }
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.focus();
        return;
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].indexOf(event.key) === -1) {
        return;
      }
      event.preventDefault();
      setOpen(true);
      var index = items.indexOf(document.activeElement);
      if (event.key === "Home") {
        index = 0;
      } else if (event.key === "End") {
        index = items.length - 1;
      } else if (index === -1) {
        var active = root.querySelector("[data-lang-switch].active");
        index = event.key === "ArrowDown" ? Math.max(items.indexOf(active), 0) : items.length - 1;
      } else if (event.key === "ArrowDown") {
        index = (index + 1) % items.length;
      } else {
        index = (index - 1 + items.length) % items.length;
      }
      items[index].focus();
    });
  }

  // ---------- Mobile menu ----------

  function updateMenuToggleLabel() {
    var toggle = document.getElementById("menu-toggle");
    if (!toggle) {
      return;
    }
    var open = document.body.classList.contains("menu-open");
    var label = t(open ? "menuClose" : "menuOpen");
    if (label) {
      toggle.setAttribute("aria-label", label);
    }
  }

  function initMobileMenu() {
    var toggle = document.getElementById("menu-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) {
      return;
    }

    function setOpen(open) {
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      updateMenuToggleLabel();
    }

    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("menu-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && document.body.classList.contains("menu-open")) {
        setOpen(false);
      }
    });
  }

  // ---------- Active section in navigation ----------

  function initScrollSpy() {
    if (!("IntersectionObserver" in window)) {
      return;
    }
    var links = {};
    document.querySelectorAll('.primary-nav a[href^="#"]').forEach(function (link) {
      links[link.getAttribute("href").slice(1)] = link;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) {
          return;
        }
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (id) {
            links[id].removeAttribute("aria-current");
          });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });
  }

  // ---------- Consent banner ----------

  function initConsent() {
    var banner = document.getElementById("consent-banner");
    var accept = document.getElementById("consent-accept");
    var reject = document.getElementById("consent-reject");
    var settings = document.getElementById("consent-settings");
    if (!banner || !accept || !reject) {
      return;
    }

    var decision = readStorage(CONSENT_STORAGE_KEY);
    if (decision !== "granted" && decision !== "denied") {
      banner.classList.add("show");
    }

    function decide(value) {
      if (typeof window.lwtechSetAnalyticsConsent === "function") {
        window.lwtechSetAnalyticsConsent(value);
      }
      banner.classList.remove("show");
    }

    accept.addEventListener("click", function () {
      decide("granted");
    });
    reject.addEventListener("click", function () {
      decide("denied");
    });
    if (settings) {
      settings.addEventListener("click", function () {
        banner.classList.add("show");
        accept.focus();
      });
    }
  }

  // ---------- Contact form ----------

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    var submit = document.getElementById("contact-submit");
    if (!form || !status || !submit || !window.fetch || !window.FormData) {
      return;
    }

    function setStatus(state, key) {
      status.setAttribute("data-state", state);
      status.textContent = key ? t(key) || "" : "";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submit.disabled = true;
      setStatus("pending", "formSending");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP " + response.status);
          }
          form.reset();
          setStatus("success", "formSuccess");
        })
        .catch(function () {
          setStatus("error", "formError");
        })
        .then(function () {
          submit.disabled = false;
        });
    });
  }

  // ---------- Init ----------

  var queryLanguage = getLanguageFromQuery();
  if (queryLanguage) {
    writeStorage(LANG_STORAGE_KEY, queryLanguage);
  }
  var storedLanguage = readStorage(LANG_STORAGE_KEY);

  initTheme();
  applyLanguage(queryLanguage || (storedLanguage ? normalizeLanguage(storedLanguage) : detectLanguageFromBrowser()));
  initLanguageMenu();
  initMobileMenu();
  initScrollSpy();
  initConsent();
  initContactForm();
})();
