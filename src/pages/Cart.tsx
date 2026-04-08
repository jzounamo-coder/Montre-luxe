import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle, CreditCard, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoadingPaystack, setIsLoadingPaystack] = useState(false);

  const PAYSTACK_PUBLIC_KEY = "pk_test_751556b96095e7074ff1c795edaab0c084eab9b5"; 

  const saveOrder = async (method: string, status: string = 'en_attente') => {
    try {
      const { error } = await supabase
        .from('Commande')
        .insert([{
          userId: user?.email,
          total: total,
          statut: status,
          items: items,
          payment_method: method
        }]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Erreur Supabase:", err);
      // On ne bloque pas tout, on prévient juste
      return false; 
    }
  };

  const handleWhatsApp = async () => {
    await saveOrder('whatsapp');
    const myPhoneNumber = "242068518085";
    const message = `*COMMANDE PRESTIGE*%0A%0ATotal : ${total.toLocaleString()} €`;
    window.open(`https://wa.me/${myPhoneNumber}?text=${message}`, '_blank');
    setShowCheckoutModal(false);
  };

  // --- FONCTION PAYSTACK VERSION ULTIME ---
  const handlePaystack = () => {
    setIsLoadingPaystack(true);

    // 1. On vérifie si le script existe déjà, sinon on le crée
    if (!(window as any).PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => setupAndOpenPaystack();
    } else {
      setupAndOpenPaystack();
    }
  };

  const setupAndOpenPaystack = () => {
    setIsLoadingPaystack(false);
    
    // On définit les fonctions de rappel à part pour éviter l'erreur "Attribute callback..."
    const onPaymentSuccess = (response: any) => {
      console.log("Succès:", response);
      toast.success("Paiement validé !");
      saveOrder('paystack', 'payé');
      setShowCheckoutModal(false);
      navigate('/profile');
    };

    const onPaymentClose = () => {
      toast.info("Paiement annulé.");
    };

    try {
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user?.email || 'client@mail.com',
        amount: Math.round(total * 100),
        currency: 'USD', // Garder USD pour le mode test
        ref: 'PRESTIGE-' + Math.floor(Math.random() * 1000000000 + 1),
        callback: onPaymentSuccess, // On passe la référence de la fonction
        onClose: onPaymentClose
      });

      handler.openIframe();
    } catch (error) {
      console.error("Erreur Setup Paystack:", error);
      toast.error("Le guichet n'a pas pu s'ouvrir.");
    }
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <header className="mb-12"><h1 className="text-4xl font-serif text-center lg:text-left">Votre Panier</h1></header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {items.map((item) => (
              <div key={item._id} className="flex gap-6 p-6 luxury-card rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm">
                <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded-lg" />
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between">
                    <h3 className="font-serif text-xl">{item.name}</h3>
                    <button onClick={() => removeFromCart(item._id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md">
                      <button onClick={() => updateQuantity(item._id, -1)} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"><Minus size={14} /></button>
                      <span className="px-4 font-mono text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"><Plus size={14} /></button>
                    </div>
                    <span className="font-mono text-lg font-semibold">{(item.price * item.quantity).toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="luxury-card p-8 sticky top-32 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-lg">
              <h3 className="font-serif text-2xl mb-8">Récapitulatif</h3>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between font-serif text-xl mb-8">
                <span>Total</span>
                <span className="text-gold font-bold">{total.toLocaleString()} €</span>
              </div>
              <button onClick={() => setShowCheckoutModal(true)} className="w-full luxury-button py-4 rounded-xl flex items-center justify-center gap-3 bg-zinc-950 text-white hover:bg-zinc-800 transition-all">
                Finaliser la commande <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-950 w-full max-w-md p-8 rounded-2xl shadow-2xl relative border border-white/5 overflow-hidden">
              <button onClick={() => !isLoadingPaystack && setShowCheckoutModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white"><X size={20} /></button>
              <h2 className="font-serif text-2xl mb-8 text-center">Paiement</h2>
              <div className="space-y-4">
                <button onClick={handleWhatsApp} className="w-full flex items-center gap-4 p-4 border border-zinc-100 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all rounded-xl group text-left">
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-full group-hover:scale-110 transition-transform"><MessageCircle size={24} /></div>
                  <div><p className="font-serif text-lg font-medium">WhatsApp</p><p className="text-[10px] text-zinc-500 uppercase">Paiement Manuel</p></div>
                </button>
                <button onClick={handlePaystack} disabled={isLoadingPaystack} className="w-full flex items-center gap-4 p-4 border border-zinc-100 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all rounded-xl group text-left">
                  <div className="p-3 bg-gold/10 text-gold rounded-full group-hover:scale-110 transition-transform">
                    {isLoadingPaystack ? <Loader2 size={24} className="animate-spin" /> : <CreditCard size={24} />}
                  </div>
                  <div><p className="font-serif text-lg font-medium">Carte / Mobile Money</p><p className="text-[10px] text-zinc-500 uppercase">Automatique</p></div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};