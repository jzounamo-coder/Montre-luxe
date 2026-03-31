import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyCollection = () => {
  const { user, favorites } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/favorites', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        setFavoriteProducts(data);
        setLoading(false);
      });
    }
  }, [favorites, user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
      />
    </div>
  );

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <Heart size={64} className="text-zinc-200 dark:text-zinc-800 mb-6" />
        <h2 className="text-3xl font-serif mb-4">Votre collection est vide</h2>
        <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-8">Ajoutez vos montres préférées pour les retrouver ici</p>
        <Link to="/catalog" className="luxury-button">Découvrir les collections</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-5xl font-serif mb-4">Ma Collection</h1>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs">Vos garde-temps favoris</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favoriteProducts.map((product) => (
            <ProductCard key={product._id} product={product} showRemove={true} />
          ))}
        </div>
      </div>
    </div>
  );
};
