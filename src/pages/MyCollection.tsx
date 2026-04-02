import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion'; 
import { Heart, Ticket, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface Commande {
  id: string;
  createdAt: string;
  total: number;
  statut: string;
}

export const MyCollection = () => {
  const { user, favorites } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      try {
        // 1. Récupérer les COMMANDES (Tickets) depuis ton serveur Node
        const cmdRes = await fetch('/api/commandes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cmdRes.ok) {
          const cmdData = await cmdRes.json();
          setCommandes(cmdData);
        }

        // 2. Récupérer les FAVORIS depuis Supabase
        if (user && favorites && favorites.length > 0) {
          const { data, error } = await supabase
            .from('Product')
            .select('*')
            .in('id', favorites);

          if (error) throw error;

          if (data) {
            const formattedData = data.map((p: any) => ({
              ...p,
              _id: p.id,
              image: p.image || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=500',
              colors: p.colors || [],
            }));
            setFavoriteProducts(formattedData);
          }
        }
      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [favorites, user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- SECTION 1 : MES ACQUISITIONS (TICKETS) --- */}
        <section className="mb-20">
          <header className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h1 className="text-4xl font-serif mb-2 italic">Mes Acquisitions</h1>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">Vos tickets de caisse numériques</p>
          </header>

          {commandes.length === 0 ? (
            <div className="p-10 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
              <Package className="mx-auto mb-4 text-zinc-300" size={32} />
              <p className="text-sm text-zinc-500 uppercase tracking-widest">Aucun achat pour le moment</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {commandes.map((cmd) => (
                <motion.div 
                  key={cmd.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="luxury-card p-6 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <h3 className="font-mono text-xs uppercase">Réf: {cmd.id.slice(0, 8)}</h3>
                      <div className="flex items-center gap-2 text-zinc-500 text-[10px] mt-1">
                        <Calendar size={12} />
                        {new Date(cmd.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-serif text-lg text-gold">{cmd.total.toLocaleString()} €</p>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400">{cmd.statut}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* --- SECTION 2 : MES FAVORIS --- */}
        <section>
          <header className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h2 className="text-4xl font-serif mb-2 italic text-zinc-400">Mes Favoris</h2>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">Les pièces que vous convoitez</p>
          </header>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-10">
               <Heart size={32} className="mx-auto text-zinc-200 mb-4" />
               <Link to="/" className="text-xs uppercase tracking-widest text-gold hover:underline">Découvrir les modèles</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favoriteProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};