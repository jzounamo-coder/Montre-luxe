import React from 'react';
import { motion } from 'motion/react';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-luxury-black pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-gold uppercase tracking-[0.6em] text-[10px] font-bold mb-4 block">Élégance Montre</span>
          <h1 className="text-5xl md:text-6xl font-serif mb-6 italic">{title}</h1>
          {subtitle && (
            <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.4em] text-[10px]">{subtitle}</p>
          )}
          <div className="w-20 h-[1px] bg-gold mx-auto mt-8" />
        </motion.header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-zinc dark:prose-invert max-w-none"
        >
          <div className="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm uppercase tracking-wider">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
