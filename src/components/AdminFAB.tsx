import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export const AdminFAB = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        to="/admin"
        className="flex items-center gap-3 bg-gold text-luxury-black px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300 font-bold uppercase tracking-[0.2em] text-xs border-2 border-white/20"
      >
        <LayoutDashboard size={20} />
        <span>Dashboard Admin</span>
      </Link>
    </motion.div>
  );
};
