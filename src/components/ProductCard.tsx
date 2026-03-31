import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Star, Shield, Palette, Globe, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  showRemove?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showRemove }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite, isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Veuillez vous connecter pour ajouter à votre collection.");
    toggleFavorite(product._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative luxury-card overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 dark:bg-luxury-black">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          animate={{ 
            rotateY: isHovered ? "180deg" : "0deg",
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.condition === 'new' && (
            <span className="bg-gold text-luxury-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-lg">Nouveau</span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-lg">Stock Limité</span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full hover:bg-white/20 dark:hover:bg-black/40 transition-all border border-white/10"
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-all duration-300",
              isFavorite(product._id) ? "fill-red-500 text-red-500 scale-110" : "text-white"
            )} 
          />
        </motion.button>

        {/* Hover Overlay Details */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-luxury-black/90 backdrop-blur-md p-6 flex flex-col justify-center text-white"
            >
              <h4 className="font-serif text-xl mb-4 text-gold">{product.name}</h4>
              <div className="space-y-3 text-[11px] uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-gold" />
                  {/* SÉCURITÉ : On vérifie si la garantie existe */}
                  <span className="opacity-80">{product.warranty ? "Garantie Internationale" : "Garantie Standard"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-gold" />
                  {/* SÉCURITÉ : Le ?. empêche le crash si colors est vide */}
                  <span className="opacity-80">{product.colors?.join(', ') || "Acier Inoxydable"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-gold" />
                  <span className="opacity-80">Origine: {product.origin || "Suisse"}</span>
                </div>
              </div>
              <p className="mt-6 text-[10px] leading-relaxed italic opacity-60 line-clamp-4">{product.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold mb-1 font-bold">{product.category}</p>
            <h3 className="font-serif text-lg group-hover:text-gold transition-colors duration-300">{product.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-gold text-gold" />
            <span className="text-xs font-bold opacity-60">4.8</span>
          </div>
        </div>
        
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 leading-relaxed uppercase tracking-widest opacity-80">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-100 dark:border-white/5">
          <div className="flex flex-col">
            <span className="font-mono text-lg tracking-tighter">
              {product.price ? product.price.toLocaleString() : "---"} FCFA
            </span>
            {showRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product._id);
                  toast.success("Retiré de votre collection");
                }}
                className="text-[8px] text-red-500 uppercase tracking-widest mt-1 hover:underline text-left"
              >
                Retirer de la collection
              </button>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-luxury-black dark:border-gold hover:text-gold hover:border-gold transition-all duration-300 pb-1"
          >
            Acquérir
          </button>
        </div>
      </div>
    </motion.div>
  );
};