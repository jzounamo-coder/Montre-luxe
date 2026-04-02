import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion'; 
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const MyCollection = () => {
  const { user, favorites } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      // Si pas d'utilisateur ou pas de favoris, on arrête le chargement immédiatement
      if (!user || !favorites || favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      try {
        // OPTIMISATION : On ne montre le gros loader que si la liste est vide.
        // Si on a déjà des produits, on met à jour en arrière-plan pour éviter la ligne blanche.
        if (favoriteProducts.length === 0) {
          setLoading(true);
        }

        const { data, error } = await supabase
          .from('Product')
          .select('*')
          .in('id', favorites);

        if (error) throw error;

        if (data) {
          const formattedData = data.map((p: any) => ({
            ...p,
            _id: p.id,
            image: p.image || p.image_url || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=500',
            features: p.features || [],
            colors: p.colors || [],
            tags: p.tags || []
          }));
          setFavoriteProducts(formattedData);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
    // On retire favoriteProducts de la dépendance pour éviter les boucles infinies
  }, [favorites, user]);

  // Loader plein écran uniquement au premier chargement réel
  if (loading && favoriteProducts.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
      />
    </div>
  );

  if (!loading && favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <Heart size={64} className="text-zinc-200 dark:text-zinc-800 mb-6" />
        <h2 className="text-3xl font-serif mb-4 italic text-center">Votre collection est vide</h2>
        <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-8 text-center">Ajoutez vos montres préférées pour les retrouver ici</p>
        <Link to="/" className="luxury-button">Découvrir les collections</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-serif mb-4 italic">Ma Collection</h1>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs">Vos garde-temps favoris</p>
          </motion.div>
        </header>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {favoriteProducts.map((product) => (
            <motion.div layout key={product._id}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};