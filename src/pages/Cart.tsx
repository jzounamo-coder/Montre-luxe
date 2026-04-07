import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle, CreditCard, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // --- CONFIGURATION PAYSTACK (TEST) ---
  const PAYSTACK_PUBLIC_KEY = "pk_test_751556b96095e7074ff1c795edaab0c084eab9b5"; 

  const saveOrder = async (method: string) => {
    console.log("Sauvegarde de la commande Supabase...");
    try {
      const { error } = await supabase
        .from('Commande')
        .insert([{
          userId: user?.email,
          total: total,
          statut: 'en_attente',
          items: items,
          payment_method: method
        }]);

      if (error) {
        console.error("Erreur Supabase:", error);
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleWhatsApp = async () => {
    const success = await saveOrder('whatsapp');
    if (!success) return;

    const myPhoneNumber = "242068518085";
    const itemsDescription = items.map(item => `• *${item.name}* (x${item.quantity})`).join('%0A');
    const message = `*COMMANDE PRESTIGE*%0A%0AJe souhaite valider ma commande :%0A${itemsDescription}%0A%0A*TOTAL : ${total.toLocaleString()} €*`;
    
    window.open(`https://wa.me/${myPhoneNumber}?text=${message}`, '_blank');
    setShowCheckoutModal(false);
  };

  // --- FONCTION PAYSTACK (FIXÉ POUR TEST) ---
  const handlePaystack = async () => {
    console.log("--- INITIALISATION PAYSTACK ---");
    
    const success = await saveOrder('paystack');
    if (!success) return;

    setShowCheckoutModal(false);
    toast.loading("Connexion au guichet sécurisé...");

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Pour débloquer le test (Erreur 400), on utilise l'USD par défaut.
      // Paystack demande le montant en centimes (total * 100).
      const finalAmount = Math.round(total * 100);

      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user?.email || 'client@mail.com',
        amount: finalAmount, 
        currency: 'USD', // Passage en USD pour valider le tunnel de test
        ref: 'PRESTIGE-' + Date.now(),
        metadata: {
          custom_fields: [
            {
              display_name: "Email Client",
              variable_name: "customer_email",
              value: user?.email
            }
          ]
        },
        callback: (response: any) => {
          console.log("Paiement réussi !", response);
          toast.success("Paiement validé avec succès !");
          navigate('/profile');
        },
        onClose: () => {
          toast.info("Paiement annulé.");
        }
      });
      handler.openIframe();
    };
  };

  const startCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setShowCheckoutModal(true);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-2 text-center lg:text-left">Votre Panier</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item._id} layout className="flex gap-6 p-6 luxury-card">
                  <div className="w-24 h-32 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-xl">{item.name}</h3>
                      <button onClick={() => removeFromCart(item._id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
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
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between font-serif text-xl mb-8">
                <span>Total</span>
                <span className="text-gold">{total.toLocaleString()} €</span>
              </div>
              <button onClick={startCheckout} className="w-full luxury-button flex items-center justify-center gap-3">
                Finaliser la commande <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-luxury-surface w-full max-w-md p-8 rounded-2xl shadow-2xl relative border border-zinc-100 dark:border-white/5"
            >
              <button onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black">
                <X size={20} />
              </button>

              <h2 className="font-serif text-2xl mb-8 text-center">Paiement</h2>

              <div className="space-y-4">
                <button onClick={handleWhatsApp} className="w-full flex items-center gap-4 p-4 border border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all group rounded-xl text-left">
                  <div className="p-3 bg-green-500/10 text-green-500 rounded-full group-hover:scale-110 transition-transform">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <p className="font-serif text-lg">Option Prestige (WhatsApp)</p>
                    <p className="text-[10px] uppercase text-zinc-500">Discussion & Livraison directe</p>
                  </div>
                </button>

                <button 
                  onClick={handlePaystack} 
                  className="w-full flex items-center gap-4 p-4 border border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all group rounded-xl text-left"
                >
                  <div className="p-3 bg-gold/10 text-gold rounded-full group-hover:scale-110 transition-transform">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-serif text-lg">Mobile Money / Carte</p>
                    <p className="text-[10px] uppercase text-zinc-500">Paiement via Paystack</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};