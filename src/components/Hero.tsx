import React from 'react';
import { motion } from 'framer-motion'; // Vérifie si c'est 'framer-motion' ou 'motion/react' selon ton installation
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- ON AJOUTE LES "PROPS" ICI ---
interface HeroProps {
  title: string;
  subtitle: string;
}

export const Hero = ({ title, subtitle }: HeroProps) => {
  const { isAdmin } = useAuth();

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Watch" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-black/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="text-gold uppercase tracking-[0.5em] text-xs font-bold mb-4 block">L'Excellence du Temps</span>
          
          {/* UTILISATION DU TITRE DYNAMIQUE */}
          <h1 className="text-6xl md:text-7xl font-serif text-white leading-tight mb-8">
            {title}
          </h1>

          {/* UTILISATION DU SOUS-TITRE DYNAMIQUE */}
          <p className="text-white/70 text-lg mb-10 font-light max-w-lg leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-wrap gap-6">
            <a href="#catalog" className="luxury-button flex items-center gap-3">
              Explorer la Collection <ArrowRight size={16} />
            </a>
            {isAdmin && (
              <Link to="/admin" className="px-8 py-3 bg-gold text-luxury-black uppercase tracking-widest text-xs font-bold hover:bg-white transition-all duration-300 flex items-center gap-2">
                <LayoutDashboard size={16} /> Dashboard Admin
              </Link>
            )}
            <Link to="/about" className="px-8 py-3 border border-white/30 text-white uppercase tracking-widest text-xs font-medium hover:bg-white hover:text-luxury-black transition-all duration-300">
              Notre Histoire
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div 
        animate={{ rotate: "360deg" }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -right-64 -bottom-64 w-[800px] h-[800px] border border-gold/10 rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ rotate: "-360deg" }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute -right-32 -bottom-32 w-[400px] h-[400px] border border-gold/20 rounded-full pointer-events-none"
      />
    </section>
  );
};