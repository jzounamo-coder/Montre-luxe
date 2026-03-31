import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Award, Truck, ShieldCheck, Clock, Filter, Search as SearchIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Home = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]); // Renommé 'Product' en 'products' pour plus de clarté
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    functionType: '',
  });

  // 1. Chargement des produits via Supabase avec protection des données
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Product') 
          .select('*');

        if (error) throw error;

        if (data) {
          // PROTECTION : On nettoie les données pour éviter le crash .join()
          const formattedData = data.map((p: any) => ({
            ...p,
            _id: p.id || p._id, // Utilise l'ID Supabase
            // Si ces colonnes n'existent pas ou sont vides, on met un tableau vide []
            // C'est ce qui évite la page blanche au survol/clic
            features: p.features || [],
            colors: p.colors || [],
            tags: p.tags || [],
            // Sécurité pour l'image
            image: p.image || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=500'
          }));
          setProducts(formattedData);
        }
      } catch (err) {
        console.error("Erreur Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. Synchronisation intelligente entre Recherche URL et Filtres
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchFromUrl = params.get('search');
    
    if (searchFromUrl) {
      const term = searchFromUrl.toLowerCase();
      setSearchTerm(searchFromUrl);

      const newFilters = { ...filters };

      if (['sport', 'luxury', 'vintage', 'luxe'].includes(term)) {
        newFilters.category = term === 'luxe' ? 'luxury' : term;
      }
      if (['homme', 'men', 'hommes'].includes(term)) newFilters.gender = 'men';
      if (['femme', 'women', 'femmes'].includes(term)) newFilters.gender = 'women';
      if (['automatique', 'automatic'].includes(term)) newFilters.functionType = 'automatic';
      if (['mecanique', 'mechanical'].includes(term)) newFilters.functionType = 'mechanical';
      if (['quartz'].includes(term)) newFilters.functionType = 'quartz';

      setFilters(newFilters);

      setTimeout(() => {
        const catalog = document.getElementById('catalog');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setSearchTerm('');
      setFilters({ category: '', gender: '', functionType: '' });
    }
  }, [location.search]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || p.category === filters.category;
    const matchesGender = !filters.gender || p.gender === filters.gender;
    const matchesFunction = !filters.functionType || p.functionType === filters.functionType;
    
    return matchesSearch && matchesCategory && matchesGender && matchesFunction;
  });

  return (
    <div className="min-h-screen">
      <Hero 
        title="Élégance Montre"
        subtitle="L'excellence horlogère au cœur du Congo. Découvrez une sélection de garde-temps d'exception, alliant tradition suisse et prestige contemporain."
      />

      {/* Section Histoire */}
      <section id="history" className="py-24 bg-white dark:bg-luxury-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1200" 
                  alt="L'art de l'horlogerie"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-gold p-8 rounded-2xl hidden md:block">
                <p className="text-luxury-black font-serif text-4xl font-bold italic">1924</p>
                <p className="text-luxury-black text-[10px] uppercase tracking-widest font-bold">Héritage</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="font-serif text-4xl md:text-5xl italic leading-tight">
                Une Histoire d'Excellence <br />
                <span className="text-gold">Élégance Montre</span>
              </h2>
              <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm uppercase tracking-wider">
                <p>Depuis plus d'un siècle, Élégance Montre s'est imposée comme la référence absolue de la haute horlogerie au Congo.</p>
                <p>Chaque montre de notre collection est le fruit d'une sélection rigoureuse.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-50 dark:bg-luxury-black border-y border-zinc-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[ 
              { icon: <Award size={28} />, title: "Qualité Certifiée", desc: "Authentifiée par nos experts." },
              { icon: <Truck size={28} />, title: "Livraison Sécurisée", desc: "Expédition express assurée." },
              { icon: <ShieldCheck size={28} />, title: "Garantie Étendue", desc: "Jusqu'à 5 ans de garantie." },
              { icon: <Clock size={28} />, title: "Service 24/7", desc: "Assistance personnalisée." }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-4 group">
                <div className="inline-flex p-5 bg-white dark:bg-luxury-surface rounded-full text-gold shadow-sm mb-2 group-hover:scale-110 transition-transform duration-500 border border-zinc-100 dark:border-white/5">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalog" className="py-24 bg-white dark:bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-20 text-center">
            <h2 className="text-5xl md:text-6xl font-serif mb-6 italic">Le Catalogue Élégance</h2>
          </header>

          {/* Search & Filters */}
          <div className="space-y-12 mb-20">
            <div className="max-w-2xl mx-auto relative group">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-gold transition-colors" size={18} />
              <input 
                type="text"
                placeholder="RECHERCHER UNE MONTRE..."
                className="w-full bg-zinc-50 dark:bg-luxury-surface border border-zinc-100 dark:border-white/5 py-5 pl-16 pr-6 text-[10px] uppercase tracking-[0.3em] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-12 pb-10 border-b border-zinc-100 dark:border-white/5">
              <select value={filters.category} className="bg-transparent text-[10px] uppercase tracking-[0.3em] outline-none" onChange={(e) => setFilters({...filters, category: e.target.value})}>
                <option value="">Toutes les Catégories</option>
                <option value="luxury">Luxe</option>
                <option value="sport">Sport</option>
                <option value="vintage">Vintage</option>
              </select>
              <select value={filters.gender} className="bg-transparent text-[10px] uppercase tracking-[0.3em] outline-none" onChange={(e) => setFilters({...filters, gender: e.target.value})}>
                <option value="">Tous les Genres</option>
                <option value="men">Hommes</option>
                <option value="women">Femmes</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};