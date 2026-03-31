import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-luxury-black pt-24 pb-12 border-t border-zinc-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex flex-col group">
              <span className="font-serif text-3xl tracking-[0.2em] font-bold uppercase group-hover:text-gold transition-colors duration-500">Élégance</span>
              <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-bold">Montre</span>
            </Link>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-loose uppercase tracking-[0.2em] max-w-xs">
              Le temps est le luxe ultime. Nous vous aidons à le capturer avec élégance et précision au Congo depuis 1924.
            </p>
          </div>

          {/* En Savoir Plus */}
          <div>
            <h4 className="font-serif text-xl mb-8 italic">En Savoir Plus</h4>
            <ul className="space-y-5 text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              <li><Link to="/water-resistance" className="hover:text-gold transition-colors duration-300">Résistance à l'eau</Link></li>
              <li><Link to="/usage" className="hover:text-gold transition-colors duration-300">Conditions d'utilisation</Link></li>
              <li><Link to="/warranty" className="hover:text-gold transition-colors duration-300">Garantie</Link></li>
              <li><Link to="/privacy" className="hover:text-gold transition-colors duration-300">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h4 className="font-serif text-xl mb-8 italic">Service Client</h4>
            <ul className="space-y-5 text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              <li><Link to="/returns" className="hover:text-gold transition-colors duration-300">Retours (30 jours)</Link></li>
              <li><Link to="/shipping" className="hover:text-gold transition-colors duration-300">Expédition & Livraison</Link></li>
              <li className="text-gold font-bold">Contact: 242 06 851 80 85</li>
              <li>Email: Jzounamo@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-500">
            © 2026 Élégance Montre. Tous droits réservés.
          </p>
          <div className="flex space-x-10 text-[9px] uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">
            <Link to="/admin" className="hover:text-gold transition-colors duration-300 font-bold">Dashboard</Link>
            <a href="https://instagram.com/elegance_montre" className="hover:text-gold transition-colors duration-300">Instagram</a>
            <a href="https://tiktok.com/@elegance_montre" className="hover:text-gold transition-colors duration-300">TikTok</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
