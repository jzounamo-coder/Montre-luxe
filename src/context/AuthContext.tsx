import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Charger les favoris depuis SUPABASE au démarrage ou à la connexion
  const fetchUserFavorites = async (userId: string) => {
    const { data, error } = await supabase
      .from('Favorite')
      .select('product_id')
      .eq('user_id', userId);
    
    if (!error && data) {
      setFavorites(data.map(f => f.product_id));
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser({
          token: session.access_token,
          email: session.user.email || '',
          role: session.user.email === 'jzounamo@gmail.com' ? 'admin' : 'user'
        });
        await fetchUserFavorites(session.user.id); // Charger les favoris ici
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser({
          token: session.access_token,
          email: session.user.email || '',
          role: session.user.email === 'jzounamo@gmail.com' ? 'admin' : 'user'
        });
        await fetchUserFavorites(session.user.id);
      } else {
        setUser(null);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Veuillez vous connecter");
      return;
    }

    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (!sbUser) return;

    const isFav = favorites.includes(productId);

    if (isFav) {
      // Supprimer de Supabase
      const { error } = await supabase
        .from('Favorite')
        .delete()
        .eq('user_id', sbUser.id)
        .eq('product_id', productId);
      
      if (!error) {
        setFavorites(prev => prev.filter(id => id !== productId));
        toast.success("Retiré de la collection");
      }
    } else {
      // Ajouter dans Supabase
      const { error } = await supabase
        .from('Favorite')
        .insert([{ user_id: sbUser.id, product_id: productId }]);
      
      if (!error) {
        setFavorites(prev => [...prev, productId]);
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
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin', favorites, toggleFavorite, isFavorite }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};