import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    const shouldBeDark = hour >= 18 || hour < 6;
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <button 
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 z-50 p-3 bg-gold text-luxury-black rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      {children}
    </div>
  );
};
