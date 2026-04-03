import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
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

  // Utilisation de l'email pour correspondre à ta table Supabase
  const fetchUserFavorites = useCallback(async (email: string) => {
    const { data, error } = await supabase
      .from('Favorite')
      .select('product_id')
      .eq('user_id', email); // On filtre par email comme dans ta table
    
    if (!error && data) {
      setFavorites(data.map(f => f.product_id));
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userEmail = session.user.email || '';
          const userData: User = {
            token: session.access_token,
            email: userEmail,
            // Sécurité Admin mise à jour
            role: (userEmail === 'admin@gmail.com' || userEmail === 'admin@elegance.com') ? 'admin' : 'user'
          };
          setUser(userData);
          fetchUserFavorites(userEmail); 
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userEmail = session.user.email || '';
        setUser({
          token: session.access_token,
          email: userEmail,
          role: (userEmail === 'admin@gmail.com' || userEmail === 'admin@elegance.com') ? 'admin' : 'user'
        });
        fetchUserFavorites(userEmail);
      } else {
        setUser(null);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserFavorites]);

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Veuillez vous connecter");
      return;
    }

    const isFav = favorites.includes(productId);
    const previousFavorites = [...favorites];

    // Mise à jour Optimiste (Interface rapide)
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== productId));
    } else {
      setFavorites(prev => [...prev, productId]);
    }

    if (isFav) {
      const { error } = await supabase
        .from('Favorite')
        .delete()
        .eq('user_id', user.email) // On utilise user.email (ton texte en base)
        .eq('product_id', productId);
      
      if (error) {
        setFavorites(previousFavorites);
        toast.error("Erreur lors de la suppression");
      } else {
        toast.success("Retiré de la collection");
      }
    } else {
      const { error } = await supabase
        .from('Favorite')
        .insert([{ 
            user_id: user.email, // On insère l'email
            product_id: productId 
        }]);
      
      if (error) {
        setFavorites(previousFavorites);
        console.error("Détail erreur insertion:", error);
        toast.error("Erreur lors de l'ajout");
      } else {
        toast.success("Ajouté à la collection");
      }
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.info("Déconnexion réussie");
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