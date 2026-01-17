import { useEffect } from 'react';

/**
 * Hook per proteggere i contenuti del sito
 * - Disabilita click destro (context menu)
 * - Disabilita scorciatoie tastiera per copia/salva/ispeziona
 * - Disabilita drag & drop
 * - Disabilita selezione testo via JS
 */
export const useContentProtection = () => {
  useEffect(() => {
    // Disabilita click destro
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disabilita scorciatoie tastiera
    const handleKeyDown = (e) => {
      // Ctrl+C (Copia)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      // Ctrl+V (Incolla)
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        return false;
      }
      // Ctrl+X (Taglia)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Salva)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Ctrl+A (Seleziona tutto)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (Visualizza sorgente)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C (Ispeziona elemento)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+P (Stampa)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
    };

    // Disabilita drag start
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Disabilita selezione
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Disabilita copia
    const handleCopy = (e) => {
      e.preventDefault();
      return false;
    };

    // Disabilita taglia
    const handleCut = (e) => {
      e.preventDefault();
      return false;
    };

    // Aggiungi tutti gli event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
    };
  }, []);
};

export default useContentProtection;
