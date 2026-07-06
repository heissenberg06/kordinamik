import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Iletisim from "./pages/Iletisim";
import BizKimiz from "./pages/BizKimiz";
import UserTypeSelection from "./pages/UserTypeSelection";
import Login from "./pages/Login";
import DealerRegister from "./pages/DealerRegister";
import Kalite from "./pages/Kalite";
import Urunlerimiz from "./pages/Urunlerimiz";
import UrunDetay from "./pages/UrunDetay";
import DealerProfile from "./pages/DealerProfile";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import { LanguageProvider } from './components/LanguageContext';
import { DealerProvider } from './components/DealerContext';
import { CartProvider } from './components/CartContext';

// Scroll to top on route change to avoid landing mid-page
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <LanguageProvider>
      <DealerProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/urunlerimiz" element={<Urunlerimiz />} />
              <Route path="/urunlerimiz/:id" element={<UrunDetay />} />
              <Route path="/biz-kimiz" element={<BizKimiz />} />
              <Route path="/kalite" element={<Kalite />} />
              <Route path="/iletisim" element={<Iletisim />} />
              <Route path="/giris" element={<UserTypeSelection />} />
              <Route path="/giris/bayi" element={<Login />} />
              <Route path="/bayi-kayit" element={<DealerRegister />} />
              <Route path="/bayi-profil" element={<ProtectedRoute><DealerProfile /></ProtectedRoute>} />
              <Route path="/sepet" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Router>
        </CartProvider>
      </DealerProvider>
    </LanguageProvider>
  );
}

export default App;