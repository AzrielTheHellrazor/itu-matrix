"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type Lang = "en" | "tr";
export type Theme = "dark" | "light";

interface SitePreferencesContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const SitePreferencesContext = createContext<SitePreferencesContextValue>({
  lang: "en",
  setLang: () => {},
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

const LANG_KEY = "itu-matrix-lang";
const THEME_KEY = "itu-matrix-theme";
const PREF_EVENT = "itu-matrix-pref-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PREF_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PREF_EVENT, callback);
  };
}

function getLangSnapshot(): Lang {
  try {
    const val = window.localStorage.getItem(LANG_KEY);
    if (val === "tr" || val === "en") return val;
  } catch {
    // Ignore storage errors
  }
  return "en";
}

function getThemeSnapshot(): Theme {
  try {
    const val = window.localStorage.getItem(THEME_KEY);
    if (val === "light" || val === "dark") return val;
  } catch {
    // Ignore storage errors
  }
  return "dark";
}

export function SitePreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = useSyncExternalStore<Lang>(subscribe, getLangSnapshot, () => "en");
  const theme = useSyncExternalStore<Theme>(subscribe, getThemeSnapshot, () => "dark");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  const setLang = (next: Lang) => {
    try {
      window.localStorage.setItem(LANG_KEY, next);
      window.dispatchEvent(new Event(PREF_EVENT));
    } catch {
      // Ignore storage errors
    }
  };

  const setTheme = (next: Theme) => {
    try {
      window.localStorage.setItem(THEME_KEY, next);
      window.dispatchEvent(new Event(PREF_EVENT));
    } catch {
      // Ignore storage errors
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SitePreferencesContext.Provider
      value={{ lang, setLang, theme, setTheme, toggleTheme }}
    >
      {children}
    </SitePreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  return useContext(SitePreferencesContext);
}
