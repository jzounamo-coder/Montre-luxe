import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, LogOut, Loader2, Settings, ShieldCheck, UserPlus, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // État pour le menu profil
  const [isDark, setIsDark] = useState(false); // État pour le mode sombre
  const [navSearch, setNavSearch] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsProfileOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(navSearch)}#catalog`);
      setNavSearch("");
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-luxury-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            <span className="font-serif text-2xl tracking-[0.2em] font-bold uppercase">Élégance</span>
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold">Montre</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#catalog" className="text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors">Catalogue</a>
            <a href="/#history" className="text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors">L'Histoire</a>
            {isAuthenticated && (
              <Link to="/collection" className="text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors">Ma Collection</Link>
            )}
          </div>

          {/* Icons & User Menu */}
          <div className="flex items-center space-x-6">
            
            {/* Search Desktop */}
            <form onSubmit={handleSearchSubmit} className="relative group hidden sm:flex items-center">
              <input 
                type="text" placeholder="RECHERCHER..." value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-0 group-hover:w-48 focus:w-48 transition-all duration-500 bg-zinc-100 dark:bg-white/5 border-none rounded-full py-2 text-[9px] uppercase tracking-widest outline-none px-0 group-hover:px-4 focus:px-4"
              />
              <button type="submit" className="hover:text-gold transition-colors ml-2"><Search size={20} /></button>
            </form>

            {/* Cart */}
            <Link to="/cart" className="hover:text-gold transition-colors relative">
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-luxury-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => isAuthenticated ? setIsProfileOpen(!isProfileOpen) : navigate('/login')}
                className={`hover:text-gold transition-colors p-2 rounded-full ${isProfileOpen ? 'text-gold bg-zinc-100 dark:bg-white/5' : ''}`}
              >
                <User size={22} />
              </button>

              <AnimatePresence>
                {isProfileOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 bg-white dark:bg-luxury-surface border border-zinc-100 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden py-4"
                  >
                    {/* Infos utilisateur */}
                    <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 mb-1">Connecté en tant que</p>
                      <p className="text-sm font-medium truncate text-gold">{user?.email}</p>
                    </div>

                    {/* Options du menu */}
                    <div className="py-2">
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-gold font-bold">
                          <Settings size={14} /> Tableau de Bord
                        </Link>
                      )}
                      <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                        <UserPlus size={14} /> Ajouter un compte
                      </button>
                       

                      {/* Séparateur pour le Mode Sombre intégré */}
                      <div className="mx-6 my-2 border-t border-zinc-100 dark:border-white/5"></div>
                      
                      <button 
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-between px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isDark ? <Sun size={14} /> : <Moon size={14} />}
                          <span>Mode {isDark ? 'Clair' : 'Sombre'}</span>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isDark ? 'bg-gold' : 'bg-zinc-300'}`}>
                           <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isDark ? 'left-5' : 'left-1'}`}></div>
                        </div>
                      </button>
                    </div>

                    {/* Déconnexion */}
                    <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-white/5">
                      <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-6 py-4 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        {isLoggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                        DÉCONNEXION
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu ... (garde ton code existant ici) */}
    </nav>
  );
};