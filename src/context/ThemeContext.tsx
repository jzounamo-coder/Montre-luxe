import React, { useState, useEffect } from 'react';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // On ne crée pas de bouton, on gère tout en arrière-plan
  
  useEffect(() => {
    const applyTheme = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      
      // Optionnel : On vérifie aussi si l'utilisateur a réglé son PC en mode sombre
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Si c'est la nuit OU si le système est en mode sombre, on active le dark mode
      if (isNight || prefersDark) {
        document.documentElement.classList.add('dark');
        // On peut aussi forcer le background du body pour éviter les flashs blancs
        document.body.style.backgroundColor = '#09090b'; // zinc-950
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#ffffff';
      }
    };

    applyTheme();

    // Petit plus : Si l'utilisateur change son thème système alors qu'il est sur le site
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      {children}
    </>
  );
};