import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminFAB } from './components/AdminFAB';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { AdminDashboard } from './pages/AdminDashboard';
import { MyCollection } from './pages/MyCollection';
import { Privacy } from './pages/Privacy';
import { Returns } from './pages/Returns';
import { Shipping } from './pages/Shipping';
import { Terms } from './pages/Terms';
import { Warranty } from './pages/Warranty';
import { WaterResistance } from './pages/WaterResistance';
import { UsageConditions } from './pages/UsageConditions';
import { motion } from 'framer-motion';

// --- COMPOSANT LOADING LUXE ---
const FullPageLoading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-t-2 border-gold rounded-full"
    />
    <p className="mt-6 font-serif italic text-zinc-500 uppercase tracking-[0.3em] text-[10px]">
      Maison de Haute Horlogerie
    </p>
  </div>
);

// --- PROTECTED ROUTE ---
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <FullPageLoading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

// --- CONTENU DE L'APP ---
const AppContent = () => {
  const { isAdmin, loading } = useAuth();

  // Si l'auth est en train de charger au premier lancement
  if (loading) return <FullPageLoading />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          
          <Route 
            path="/my-collection" 
            element={
              <ProtectedRoute>
                <MyCollection />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/usage" element={<Terms />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/water-resistance" element={<WaterResistance />} />
          <Route path="/usage-conditions" element={<UsageConditions />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {isAdmin && <AdminFAB />}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}