import React, { createContext, useContext, useState, useCallback } from 'react';
import translations from '../translations/index.js';

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('IT');

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[currentLang];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to Italian if key not found
        let fallback = translations['IT'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found in any language
          }
        }
        return fallback;
      }
    }

    return value;
  }, [currentLang]);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setCurrentLang(lang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
