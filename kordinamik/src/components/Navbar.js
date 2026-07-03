import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Box, IconButton, Drawer, styled, Menu, MenuItem, Badge } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logoImage from "../assets/logo.png";
import { useDealer } from "./DealerContext";
import { useLanguage } from "./LanguageContext";
import { useCart } from "./CartContext";

// Styled Components
const StyledAppBar = styled(AppBar)(({ scrolled }) => ({
  background: scrolled 
    ? "rgba(220, 38, 38, 0.98)" 
    : "rgba(220, 38, 38, 0.95)",
  backdropFilter: "blur(20px)",
  borderBottom: scrolled 
    ? "1px solid rgba(185, 28, 28, 0.8)" 
    : "1px solid rgba(185, 28, 28, 0.5)",
  boxShadow: scrolled 
    ? "0 10px 30px rgba(0,0,0,0.15)" 
    : "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  padding: "8px 0",
}));

const Logo = styled(Box)(({ scrolled }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  textDecoration: "none",
  transition: "all 0.3s ease",
  "& .logo-image": {
    height: "50px",
    width: "auto",
    objectFit: "contain",
    transition: "transform 0.3s ease",
  },
  "&:hover .logo-image": {
    transform: "scale(1.05)",
  },
}));

const NavContainer = styled(Box)({
  display: "flex",
  gap: "8px",
  "@media (max-width: 968px)": {
    display: "none",
  },
});

const NavLink = styled(Link)(({ active, scrolled }) => ({
  position: "relative",
  padding: "10px 20px",
  color: "white",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: 600,
  letterSpacing: "0.5px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: active 
      ? "rgba(255, 255, 255, 0.2)"
      : "transparent",
    borderRadius: "12px",
    opacity: active ? 1 : 0,
    transition: "opacity 0.3s ease",
    zIndex: -1,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "8px",
    left: "50%",
    transform: "translateX(-50%)",
    width: active ? "30px" : "0px",
    height: "3px",
    background: "white",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },

  "&:hover": {
    color: "white",
    transform: "translateY(-2px)",
    "&::before": {
      opacity: 1,
      background: "rgba(255, 255, 255, 0.15)",
    },
    "&::after": {
      width: "30px",
    },
  },
}));

const MobileMenuButton = styled(IconButton)(({ scrolled }) => ({
  display: "none",
  color: "white",
  "@media (max-width: 968px)": {
    display: "flex",
  },
}));

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    width: "100%",
    maxWidth: "400px",
    background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    padding: "30px",
  },
});

const MobileNavLink = styled(Link)(({ active }) => ({
  display: "block",
  padding: "18px 25px",
  color: "white",
  textDecoration: "none",
  fontSize: "1.1rem",
  fontWeight: 600,
  letterSpacing: "0.5px",
  borderRadius: "15px",
  marginBottom: "10px",
  background: active 
    ? "rgba(255, 255, 255, 0.2)" 
    : "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  transform: "translateX(0)",
  
  "&:hover": {
    background: "rgba(255, 255, 255, 0.25)",
    transform: "translateX(10px)",
  },
}));

const LanguageButton = styled(Box)(({ scrolled }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  borderRadius: "50px",
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginLeft: "15px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  
  "&:hover": {
    background: "rgba(255, 255, 255, 0.3)",
    transform: "translateY(-2px)",
  },

  "& .flag": {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  "& .lang-text": {
    color: "white",
    fontWeight: 600,
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  "@media (max-width: 768px)": {
    padding: "6px 12px",
    "& .lang-text": {
      display: "none",
    },
  },
}));

const LanguageMenu = styled(Menu)({
  "& .MuiPaper-root": {
    marginTop: "10px",
    borderRadius: "15px",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    border: "1px solid rgba(99, 102, 241, 0.1)",
    minWidth: "180px",
  },
});

const LanguageMenuItem = styled(MenuItem)({
  padding: "12px 20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  transition: "all 0.2s ease",
  
  "&:hover": {
    background: "rgba(99, 102, 241, 0.08)",
  },

  "& .flag": {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  "& .language-name": {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "0.95rem",
  },
});

const CTAButton = styled(Link)(({ scrolled }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  color: "#dc2626",
  padding: "10px 25px",
  borderRadius: "50px",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: 600,
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  marginLeft: "20px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
    background: "white",
  },

  "@media (max-width: 968px)": {
    display: "none",
  },
}));

// Language data with flag emojis and translations
const languages = {
  tr: {
    code: "tr",
    name: "Türkçe",
    flag: "🇹🇷",
    translations: {
      home: "Ana Sayfa",
      products: "Ürünlerimiz", 
      about: "Biz Kimiz",
      quality: "Kalite",
      contact: "İletişim",
      getQuote: "Giriş Yap",
    }
  },
  en: {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    translations: {
      home: "Home",
      products: "Products",
      about: "About Us",
      quality: "Quality",
      contact: "Contact",
      getQuote: "Login",
    }
  },
  ru: {
    code: "ru",
    name: "Русский",
    flag: "🇷🇺",
    translations: {
      home: "Главная",
      products: "Продукты",
      about: "О нас",
      quality: "Качество",
      contact: "Контакты",
      getQuote: "Войти",
    }
  },
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const { dealer, isAuthenticated, logout } = useDealer();
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const { cartItems, clearCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current language translations
  const t = languages[currentLanguage]?.translations || languages.tr.translations;

  const navItems = [
    { label: t.home, path: "/" },
    { label: t.products, path: "/urunlerimiz" },
    { label: t.about, path: "/biz-kimiz" },
    { label: t.quality, path: "/kalite" },
    { label: t.contact, path: "/iletisim" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (langCode) => {
    setCurrentLanguage(langCode);
    handleLanguageClose();
  };

  const handleLogout = async () => {
    await logout();
    clearCart();
    setMobileOpen(false);
    window.location.href = '/';
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <>
      <StyledAppBar position="fixed" scrolled={scrolled ? 1 : 0} elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", maxWidth: "1400px", width: "100%", mx: "auto", px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Logo component={Link} to="/" scrolled={scrolled ? 1 : 0}>
            <img src={logoImage} alt="Kordinamik Logo" className="logo-image" />
          </Logo>

          {/* Desktop Navigation */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavContainer>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  active={location.pathname === item.path ? 1 : 0}
                  scrolled={scrolled ? 1 : 0}
                >
                  {item.label}
                </NavLink>
              ))}
            </NavContainer>

            {/* Language Selector */}
            <LanguageButton 
              scrolled={scrolled ? 1 : 0}
              onClick={handleLanguageClick}
            >
              <span className="flag">{languages[currentLanguage].flag}</span>
              <span className="lang-text">{languages[currentLanguage].code.toUpperCase()}</span>
              <ExpandMoreIcon sx={{ 
                color: "white", 
                fontSize: "20px",
                transition: "transform 0.3s ease",
                transform: anchorEl ? "rotate(180deg)" : "rotate(0deg)"
              }} />
            </LanguageButton>

            {/* Language Dropdown Menu */}
            <LanguageMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleLanguageClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {Object.entries(languages).map(([code, lang]) => (
                <LanguageMenuItem 
                  key={code}
                  onClick={() => handleLanguageSelect(code)}
                  selected={currentLanguage === code}
                >
                  <span className="flag">{lang.flag}</span>
                  <span className="language-name">{lang.name}</span>
                </LanguageMenuItem>
              ))}
            </LanguageMenu>

            {/* CTA Button */}
            {!isAuthenticated ? (
              <CTAButton to="/giris" scrolled={scrolled ? 1 : 0}>
                <span>{t.getQuote}</span>
                <AutoAwesomeIcon sx={{ fontSize: "18px" }} />
              </CTAButton>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
                <IconButton
                  component={Link}
                  to="/sepet"
                  sx={{ color: "white" }}
                >
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <Box
                  component={Link}
                  to="/bayi-profil"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 700
                  }}
                >
                  <AccountCircleIcon />
                  <span style={{
                    maxWidth: '160px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                  }}>
                    {dealer?.company_name || dealer?.email}
                  </span>
                </Box>
                <IconButton onClick={handleLogout} sx={{ color: "white", ml: 1 }}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}

            {/* Mobile Menu Button */}
            <MobileMenuButton
              onClick={handleDrawerToggle}
              scrolled={scrolled ? 1 : 0}
            >
              <MenuIcon sx={{ fontSize: "28px" }} />
            </MobileMenuButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <StyledDrawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {navItems.map((item) => (
          <MobileNavLink
            key={item.path}
            to={item.path}
            active={location.pathname === item.path ? 1 : 0}
            onClick={handleDrawerToggle}
          >
            {item.label}
          </MobileNavLink>
        ))}
        {isAuthenticated && (
          <MobileNavLink
            to="/sepet"
            active={location.pathname === "/sepet" ? 1 : 0}
            onClick={handleDrawerToggle}
          >
            Sepetim ({cartCount})
          </MobileNavLink>
        )}

        {/* Mobile CTA */}
          <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
          {/* Language Selector for Mobile */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            {Object.entries(languages).map(([code, lang]) => (
              <Box
                key={code}
                onClick={() => handleLanguageSelect(code)}
                sx={{
                  width: "50px",
                  height: "50px",
                  fontSize: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: currentLanguage === code 
                    ? "rgba(255, 255, 255, 0.3)" 
                    : "rgba(255, 255, 255, 0.15)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: currentLanguage === code
                    ? "2px solid white"
                    : "2px solid transparent",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                {lang.flag}
              </Box>
            ))}
          </Box>
          
          {!isAuthenticated ? (
            <Link
              to="/giris"
              style={{
                display: "block",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#dc2626",
                padding: "15px",
                borderRadius: "50px",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}
              onClick={handleDrawerToggle}
            >
              {t.getQuote}
            </Link>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Link
                to="/bayi-profil"
                style={{
                  display: "block",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#dc2626",
                  padding: "15px",
                  borderRadius: "50px",
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                }}
                onClick={handleDrawerToggle}
              >
                Hesabım
              </Link>
              <Box
                onClick={handleLogout}
                style={{
                  display: "block",
                  background: "rgba(255, 255, 255, 0.85)",
                  color: "#dc2626",
                  padding: "12px",
                  borderRadius: "50px",
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Çıkış Yap
              </Box>
            </Box>
          )}
        </Box>
      </StyledDrawer>
    </>
  );
}

export default Navbar;