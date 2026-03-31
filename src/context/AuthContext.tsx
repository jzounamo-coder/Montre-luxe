import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (token: string, role: 'user' | 'admin', email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// On définit l'adresse de ton serveur pour éviter les erreurs 404
const API_URL = "http://localhost:3000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        fetchFavorites(parsedUser.token);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const fetchFavorites = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Dans ton server.ts, les favoris reviennent sous forme d'objets produits avec un _id
        setFavorites(data.map((f: any) => f._id.toString()));
      }
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  const login = (token: string, role: 'user' | 'admin', email: string) => {
    const newUser = { token, role, email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    fetchFavorites(token);
    toast.success("Bienvenue !");
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('user');
    toast.info("Déconnexion réussie");
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Veuillez vous connecter");
      return;
    }

    const isFav = favorites.includes(productId.toString());
    const method = isFav ? 'DELETE' : 'POST';
    
    try {
      const res = await fetch(`${API_URL}/api/favorites/${productId}`, {
        method,
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        // Ton server.ts renvoie la liste complète des IDs après modification
        const updatedFavoriteIds = await res.json();
        setFavorites(updatedFavoriteIds.map((id: any) => id.toString()));
        
        if (isFav) {
          toast.success("Retiré de la collection");
        } else {
          toast.success("Ajouté à la collection");
        }
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
      toast.error("Erreur de connexion au serveur");
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId.toString());
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user, 
      isAdmin: user?.role === 'admin',
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