import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { toast } from 'sonner';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // On récupère login et register depuis le context
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // CONNEXION : On appelle la fonction du context qui gère déjà Supabase
        await login(email, password);
        navigate('/'); // Redirection après succès
      } else {
        // INSCRIPTION : On appelle la fonction register du context
        await register(email, password);
        setIsLogin(true); // Basculer vers l'écran de connexion après inscription
      }
    } catch (err: any) {
      // Les erreurs sont déjà affichées par les toasts dans le context, 
      // mais on peut aussi les afficher localement si besoin
      const errorMessage = err.message || "Une erreur est survenue";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full luxury-card p-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif mb-2">{isLogin ? 'Connexion' : 'Inscription'}</h2>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Accédez à votre espace prestige</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-gold outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-gold outline-none transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</p>}

          <button type="submit" className="w-full luxury-button mt-4">
            {isLogin ? 'Se Connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};