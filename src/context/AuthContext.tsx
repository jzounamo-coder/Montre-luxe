import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // Changé en Promise car signOut est async
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean; // <--- AJOUTÉ : Pour supprimer le rouge dans App.tsx
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour vérifier si un email est admin
  const checkAdmin = (email: string | undefined) => {
    const adminEmails = ['jzounamo@gmail.com', 'admin@elegance.com'];
    return email && adminEmails.includes(email) ? 'admin' : 'user';
  };

  const fetchUserFavorites = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('Favorite')
      .select('product_id')
      .eq('user_id', userId);
    
    if (!error && data) {
      setFavorites(data.map(f => f.product_id));
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userData: User = {
            token: session.access_token,
            email: session.user.email || '',
            role: checkAdmin(session.user.email)
          };
          setUser(userData);
          await fetchUserFavorites(session.user.id); 
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
        setUser({
          token: session.access_token,
          email: session.user.email || '',
          role: checkAdmin(session.user.email)
        });
        fetchUserFavorites(session.user.id);
      } else {
        setUser(null);
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserFavorites]);

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Veuillez vous connecter");
      return;
    }

    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (!sbUser) return;

    const isFav = favorites.includes(productId);
    const previousFavorites = [...favorites];

    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== productId));
      const { error } = await supabase
        .from('Favorite')
        .delete()
        .eq('user_id', sbUser.id)
        .eq('product_id', productId);
      
      if (error) {
        setFavorites(previousFavorites);
        toast.error("Erreur lors de la suppression");
      } else {
        toast.success("Retiré de la collection");
      }
    } else {
      setFavorites(prev => [...prev, productId]);
      const { error } = await supabase
        .from('Favorite')
        .insert([{ user_id: sbUser.id, product_id: productId }]);
      
      if (error) {
        setFavorites(previousFavorites);
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
    setUser(null);
    setFavorites([]);
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
      loading, 
      favorites, 
      toggleFavorite, 
      isFavorite 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};