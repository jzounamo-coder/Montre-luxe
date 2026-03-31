import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase'; // Importation de ton client Supabase

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>; // Changé pour gérer la vraie connexion
  register: (email: string, password: string) => Promise<void>; // Ajout de l'inscription
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Vérifier la session active au chargement
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userData: User = {
          token: session.access_token,
          email: session.user.email || '',
          role: session.user.email === 'jzounamo@gmail.com' ? 'admin' : 'user' // Définit ton admin ici
        };
        setUser(userData);
        // Ici tu pourras charger tes favoris depuis une table Supabase plus tard
      }
      setLoading(false);
    };

    initAuth();

    // 2. Écouter les changements (Connexion/Déconnexion)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          token: session.access_token,
          email: session.user.email || '',
          role: session.user.email === 'admin@elegance.com' ? 'admin' : 'user'
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fonction pour créer un compte
  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success("Compte créé ! Vérifiez vos emails (si activé).");
  };

  // Fonction de connexion réelle
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Email ou mot de passe incorrect");
      throw error;
    }
    toast.success("Heureux de vous revoir !");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setFavorites([]);
    toast.info("Déconnexion réussie");
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour gérer vos favoris");
      return;
    }

    // Logique temporaire des favoris (en local) en attendant ta table 'favorites' sur Supabase
    const isFav = favorites.includes(productId.toString());
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== productId.toString()));
      toast.success("Retiré de la collection");
    } else {
      setFavorites(prev => [...prev, productId.toString()]);
      toast.success("Ajouté à la collection");
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId.toString());
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
      favorites,
      toggleFavorite,
      isFavorite
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};