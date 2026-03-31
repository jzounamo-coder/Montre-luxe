import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState(""); // État pour le texte de recherche
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  // Gestion de la recherche globale
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      // Redirige vers la Home avec le paramètre de recherche dans l'URL
      navigate(`/?search=${encodeURIComponent(navSearch)}#catalog`);
      setNavSearch(""); // Vide le champ après validation
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
            {isAdmin && (
              <Link to="/admin" className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold border border-gold/30 px-4 py-2 rounded-full hover:bg-gold hover:text-luxury-black transition-all duration-300">Tableau de Bord</Link>
            )}
          </div>

          {/* Icons & Search */}
          <div className="flex items-center space-x-6">
            
            {/* Barre de recherche extensible */}
            <form onSubmit={handleSearchSubmit} className="relative group hidden sm:flex items-center">
              <input 
                type="text"
                placeholder="RECHERCHER..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-0 group-hover:w-48 focus:w-48 transition-all duration-500 bg-zinc-100 dark:bg-white/5 border-none rounded-full py-2 text-[9px] uppercase tracking-widest outline-none px-0 group-hover:px-4 focus:px-4"
              />
              <button type="submit" className="hover:text-gold transition-colors ml-2">
                <Search size={20} />
              </button>
            </form>

            <div className="relative group">
              <Link to="/cart" className="hover:text-gold transition-colors relative">
                <ShoppingBag size={20} />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-luxury-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden lg:block text-[10px] uppercase tracking-tighter opacity-60">{user?.email}</span>
                <button onClick={logout} className="hover:text-red-500 transition-colors"><LogOut size={18} /></button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-gold transition-colors"><User size={20} /></Link>
            )}

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-luxury-black border-b border-zinc-100 dark:border-zinc-800"
          >
            <div className="px-4 py-8 space-y-6 flex flex-col items-center">
              {/* Recherche Mobile */}
              <form onSubmit={handleSearchSubmit} className="w-full max-w-xs relative">
                <input 
                  type="text"
                  placeholder="RECHERCHER..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-white/5 border-none rounded-full py-3 px-10 text-[10px] uppercase tracking-widest outline-none"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              </form>

              <a href="/#catalog" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-[0.3em]">Catalogue</a>
              <a href="/#history" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-[0.3em]">L'Histoire</a>
              {isAuthenticated && (
                <Link to="/collection" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-[0.3em]">Ma Collection</Link>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Tableau de Bord</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};