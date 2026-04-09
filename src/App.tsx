import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// --- COMPOSANT DE GESTION DU SCROLL ---
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Si on a un # dans l'URL (ex: #catalog)
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Petit délai pour laisser React charger la page Home
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      // Sinon, on remonte tout en haut quand on change de page
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router>
            <ScrollManager /> {/* Activation du gestionnaire de scroll */}
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route 
                    path="/collection" 
                    element={
                      <ProtectedRoute>
                        <MyCollection />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/usage" element={<Terms />} />
                  <Route path="/warranty" element={<Warranty />} />
                  <Route path="/water-resistance" element={<WaterResistance />} />
                  <Route path="/usage-conditions" element={<UsageConditions />} />
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <AdminFAB />
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}