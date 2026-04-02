import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart(); // Ajoute clearCart si dispo dans ton context
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour commander');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total: total,
          items: items 
        })
      });

      if (response.ok) {
        toast.success('Commande passée avec succès ! Merci de votre confiance.');
        
        // On vide le panier localement après le succès
        if (clearCart) clearCart();

        // Redirection vers la page de collection pour voir le ticket
        setTimeout(() => navigate('/my-collection'), 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error("Erreur checkout:", error);
      toast.error('Le serveur ne répond pas. Veuillez réessayer.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <ShoppingBag size={64} className="text-zinc-200 dark:text-zinc-800 mb-6" />
        <h2 className="text-3xl font-serif mb-4">Votre panier est vide</h2>
        <p className="text-zinc-500 uppercase tracking-widest text-[10px] mb-8">Explorez nos collections pour trouver la montre de vos rêves</p>
        <Link to="/catalog" className="luxury-button">Découvrir les collections</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-2">Votre Panier</h1>
          <p className="text-zinc-500 uppercase tracking-widest text-[10px]">{items.length} article(s) sélectionné(s)</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-6 p-6 luxury-card"
                >
                  <div className="w-24 h-32 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl">{item.name}</h3>
                        <button onClick={() => removeFromCart(item._id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gold mt-1">{item.category}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-800">
                        <button onClick={() => updateQuantity(item._id, -1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-sm font-mono">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-mono text-lg">{(item.price * item.quantity).toLocaleString()} €</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="luxury-card p-8 sticky top-32">
              <h3 className="font-serif text-2xl mb-8">Récapitulatif</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                  <span>Sous-total</span>
                  <span>{total.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                  <span>Livraison</span>
                  <span>Offerte</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between font-serif text-xl">
                  <span>Total</span>
                  <span className="text-gold">{total.toLocaleString()} €</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full luxury-button flex items-center justify-center gap-3"
              >
                Passer la commande <ArrowRight size={16} />
              </button>
              
              {!isAuthenticated && (
                <p className="mt-4 text-[10px] text-center text-zinc-500 uppercase tracking-widest">
                  Veuillez vous connecter pour commander
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};