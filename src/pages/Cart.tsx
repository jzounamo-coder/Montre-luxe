import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle, CreditCard, X, ShieldCheck, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const saveOrder = async (method: string) => {
    try {
      const { error } = await supabase
        .from('Commande')
        .insert([{
          userId: user?.email,
          total: total,
          statut: method === 'whatsapp' ? 'en_attente' : 'payé',
          items: items,
          payment_method: method
        }]);
      return !error;
    } catch (err) {
      return false;
    }
  };

  const handleWhatsApp = async () => {
    const success = await saveOrder('whatsapp');
    if (!success) return;
    const myPhoneNumber = "242068518085";
    const message = `*COMMANDE PRESTIGE*%0A%0ATotal : ${total.toLocaleString()} €`;
    window.open(`https://wa.me/${myPhoneNumber}?text=${message}`, '_blank');
    setShowCheckoutModal(false);
  };

  // --- SIMULATEUR DE PAIEMENT SANS BUG ---
  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    
    // 1. On simule un temps de chargement réseau
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. On sauvegarde dans Supabase
    const success = await saveOrder('mobile_money');
    
    if (success) {
      toast.success("Paiement Mobile Money validé !");
      setShowCheckoutModal(false);
      navigate('/profile'); // Redirection vers les tickets/commandes
    } else {
      toast.error("Erreur lors de la validation.");
    }
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <ShoppingBag size={64} className="text-zinc-200 dark:text-zinc-800 mb-6" />
        <h2 className="text-3xl font-serif mb-4">Votre panier est vide</h2>
        <Link to="/catalog" className="luxury-button">Découvrir les collections</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12"><h1 className="text-4xl font-serif text-center lg:text-left">Votre Panier</h1></header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {items.map((item) => (
              <div key={item._id} className="flex gap-6 p-6 luxury-card">
                <img src={item.image} alt={item.name} className="w-24 h-32 object-cover" />
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between font-serif text-xl">
                    <h3>{item.name}</h3>
                    <button onClick={() => removeFromCart(item._id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800">
                      <button onClick={() => updateQuantity(item._id, -1)} className="p-2"><Minus size={14} /></button>
                      <span className="px-4 font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="p-2"><Plus size={14} /></button>
                    </div>
                    <span className="font-mono text-lg">{(item.price * item.quantity).toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="luxury-card p-8 sticky top-32">
              <h3 className="font-serif text-2xl mb-8">Récapitulatif</h3>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between font-serif text-xl mb-8">
                <span>Total</span>
                <span className="text-gold">{total.toLocaleString()} €</span>
              </div>
              <button onClick={() => setShowCheckoutModal(true)} className="w-full luxury-button flex items-center justify-center gap-3">
                Finaliser la commande <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-950 w-full max-w-md p-8 rounded-2xl relative border border-white/10 shadow-2xl">
              <button onClick={() => !isProcessing && setShowCheckoutModal(false)} className="absolute top-4 right-4 text-zinc-400"><X size={20} /></button>
              
              <div className="text-center mb-8">
                <ShieldCheck className="mx-auto text-gold mb-2" size={40} />
                <h2 className="font-serif text-2xl">Finaliser l'achat</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Transaction sécurisée</p>
              </div>

              {isProcessing ? (
                <div className="py-12 flex flex-col items-center">
                  <Loader2 className="animate-spin text-gold mb-4" size={48} />
                  <p className="font-serif italic text-zinc-400">Communication avec le réseau mobile...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button onClick={handleWhatsApp} className="w-full flex items-center gap-4 p-4 border border-zinc-800 hover:bg-zinc-900 transition-all rounded-xl group">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-full group-hover:scale-110 transition-transform"><MessageCircle size={24} /></div>
                    <div className="text-left"><p className="font-serif text-lg">Commander via WhatsApp</p><p className="text-[10px] text-zinc-500 uppercase">Paiement à la livraison</p></div>
                  </button>

                  <button onClick={handleSimulatedPayment} className="w-full flex items-center gap-4 p-4 border border-zinc-800 hover:bg-zinc-900 transition-all rounded-xl group">
                    <div className="p-3 bg-gold/10 text-gold rounded-full group-hover:scale-110 transition-transform"><CreditCard size={24} /></div>
                    <div className="text-left"><p className="font-serif text-lg">Mobile Money / Carte</p><p className="text-[10px] text-zinc-500 uppercase">MTN, Airtel & Cartes</p></div>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};