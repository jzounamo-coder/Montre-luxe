import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // Import de l'icône de chargement

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Active le loader
    
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/'); 
      } else {
        await register(email, password);
        setIsLogin(true); 
      }
    } catch (err: any) {
      const errorMessage = err.message || "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Désactive le loader quoi qu'il arrive
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
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-gold outline-none transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Mot de passe</label>
            <input 
              type="password" 
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 focus:border-gold outline-none transition-colors disabled:opacity-50"
            />
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full luxury-button mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>TRAITEMENT...</span>
              </>
            ) : (
              isLogin ? 'SE CONNECTER' : "S'INSCRIRE"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors disabled:opacity-50"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};