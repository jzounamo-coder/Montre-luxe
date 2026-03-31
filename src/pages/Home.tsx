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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    functionType: '',
  });

  // 1. Chargement des produits via Supabase (Correction erreur JSON)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products') // Assure-toi que le nom de ta table est bien 'products'
          .select('*');

        if (error) throw error;

        if (data) {
          // On s'assure que chaque produit a un _id (pour compatibilité avec ton interface Product)
          const formattedData = data.map((p: any) => ({
            ...p,
            _id: p._id || p.id 
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

      // --- DÉTECTION AUTOMATIQUE DES FILTRES ---
      const newFilters = { ...filters };

      // Catégories
      if (['sport', 'luxury', 'vintage', 'luxe'].includes(term)) {
        newFilters.category = term === 'luxe' ? 'luxury' : term;
      }
      // Genres
      if (['homme', 'men', 'hommes'].includes(term)) newFilters.gender = 'men';
      if (['femme', 'women', 'femmes'].includes(term)) newFilters.gender = 'women';
      // Mouvements
      if (['automatique', 'automatic'].includes(term)) newFilters.functionType = 'automatic';
      if (['mecanique', 'mechanical'].includes(term)) newFilters.functionType = 'mechanical';
      if (['quartz'].includes(term)) newFilters.functionType = 'quartz';

      setFilters(newFilters);

      setTimeout(() => {
        const catalog = document.getElementById('catalog');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Réinitialisation si pas de recherche
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

      {/* L'Histoire Section */}
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
                  referrerPolicy="no-referrer"
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
                <p>
                  Depuis plus d'un siècle, Élégance Montre s'est imposée comme la référence absolue de la haute horlogerie au Congo. Notre aventure a commencé en 1924, avec une vision simple mais audacieuse : apporter le prestige des plus grandes manufactures suisses au cœur de l'Afrique Centrale.
                </p>
                <p>
                  Chaque montre de notre collection est le fruit d'une sélection rigoureuse. Nous ne vendons pas seulement des instruments de mesure du temps ; nous transmettons des héritages, des chefs-d'œuvre d'ingénierie et des symboles de réussite. Notre expertise nous permet de conseiller les collectionneurs les plus exigeants comme les amateurs en quête de leur première pièce d'exception.
                </p>
                <p>
                  Aujourd'hui, Élégance Montre continue d'écrire son histoire en alliant tradition et modernité. Notre boutique est un sanctuaire dédié à la précision, où chaque tic-tac résonne comme une promesse de qualité et de distinction. Bienvenue dans l'univers où le temps s'arrête pour laisser place à l'élégance.
                </p>
              </div>
              <div className="pt-8">
                <button className="luxury-button">Découvrir notre héritage</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-50 dark:bg-luxury-black border-y border-zinc-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center space-y-4 group">
              <div className="inline-flex p-5 bg-white dark:bg-luxury-surface rounded-full text-gold shadow-sm mb-2 group-hover:scale-110 transition-transform duration-500 border border-zinc-100 dark:border-white/5"><Award size={28} /></div>
              <h3 className="font-serif text-xl">Qualité Certifiée</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 leading-relaxed">Chaque pièce est authentifiée par nos experts horlogers.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="inline-flex p-5 bg-white dark:bg-luxury-surface rounded-full text-gold shadow-sm mb-2 group-hover:scale-110 transition-transform duration-500 border border-zinc-100 dark:border-white/5"><Truck size={28} /></div>
              <h3 className="font-serif text-xl">Livraison Sécurisée</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 leading-relaxed">Expédition express et assurée dans le monde entier.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="inline-flex p-5 bg-white dark:bg-luxury-surface rounded-full text-gold shadow-sm mb-2 group-hover:scale-110 transition-transform duration-500 border border-zinc-100 dark:border-white/5"><ShieldCheck size={28} /></div>
              <h3 className="font-serif text-xl">Garantie Étendue</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 leading-relaxed">Jusqu'à 5 ans de garantie sur nos modèles de luxe.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="inline-flex p-5 bg-white dark:bg-luxury-surface rounded-full text-gold shadow-sm mb-2 group-hover:scale-110 transition-transform duration-500 border border-zinc-100 dark:border-white/5"><Clock size={28} /></div>
              <h3 className="font-serif text-xl">Service 24/7</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 leading-relaxed">Une assistance personnalisée pour vos investissements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-24 bg-white dark:bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <header className="mb-20 text-center">
            <span className="text-gold uppercase tracking-[0.6em] text-[10px] font-bold mb-4 block">Notre Collection Complète</span>
            <h2 className="text-5xl md:text-6xl font-serif mb-6 italic">Le Catalogue Élégance</h2>
            <p className="text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.4em] text-[10px]">L'excellence à portée de main</p>
          </header>

          {/* Search & Filters */}
          <div className="space-y-12 mb-20">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-gold transition-colors" size={18} />
              <input 
                id="catalog-search"
                type="text"
                placeholder="RECHERCHER UNE MONTRE, UNE MARQUE, UN STYLE..."
                className="w-full bg-zinc-50 dark:bg-luxury-surface border border-zinc-100 dark:border-white/5 py-5 pl-16 pr-6 text-[10px] uppercase tracking-[0.3em] focus:ring-1 focus:ring-gold/30 outline-none transition-all duration-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Selects */}
            <div className="flex flex-wrap justify-center gap-12 pb-10 border-b border-zinc-100 dark:border-white/5">
              <div className="flex items-center gap-3 text-gold">
                <Filter size={14} />
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold">Filtrer par:</span>
              </div>
              
              <select 
                value={filters.category}
                className="bg-transparent border-none text-[10px] uppercase tracking-[0.3em] focus:ring-0 cursor-pointer hover:text-gold transition-colors"
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="" className="bg-white dark:bg-luxury-black">Toutes les Catégories</option>
                <option value="luxury" className="bg-white dark:bg-luxury-black">Luxe</option>
                <option value="sport" className="bg-white dark:bg-luxury-black">Sport</option>
                <option value="vintage" className="bg-white dark:bg-luxury-black">Vintage</option>
              </select>

              <select 
                value={filters.gender}
                className="bg-transparent border-none text-[10px] uppercase tracking-[0.3em] focus:ring-0 cursor-pointer hover:text-gold transition-colors"
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
              >
                <option value="" className="bg-white dark:bg-luxury-black">Tous les Genres</option>
                <option value="men" className="bg-white dark:bg-luxury-black">Hommes</option>
                <option value="women" className="bg-white dark:bg-luxury-black">Femmes</option>
              </select>

              <select 
                value={filters.functionType}
                className="bg-transparent border-none text-[10px] uppercase tracking-[0.3em] focus:ring-0 cursor-pointer hover:text-gold transition-colors"
                onChange={(e) => setFilters({...filters, functionType: e.target.value})}
              >
                <option value="" className="bg-white dark:bg-luxury-black">Tous les Mouvements</option>
                <option value="automatic" className="bg-white dark:bg-luxury-black">Automatique</option>
                <option value="mechanical" className="bg-white dark:bg-luxury-black">Mécanique</option>
                <option value="quartz" className="bg-white dark:bg-luxury-black">Quartz</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div 
                animate={{ rotate: "360deg" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 uppercase tracking-widest text-sm italic">Aucun garde-temps ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* Luxury Quote/Banner */}
      <section className="py-32 bg-luxury-black text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif italic mb-8">
              "Le temps est la seule chose que l'on ne peut pas racheter, mais on peut choisir comment le mesurer."
            </h2>
            <div className="w-20 h-[1px] bg-gold mx-auto mb-8" />
            <p className="text-gold uppercase tracking-[0.5em] text-xs font-bold">Élégance Montre</p>
          </motion.div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="" 
            referrerPolicy="no-referrer"
          />
        </div>
      </section>
    </div>
  );
};