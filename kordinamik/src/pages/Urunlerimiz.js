import React, { useState, useEffect } from "react";
import { Box, styled, Tab, Tabs, Typography, CircularProgress, Button } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import LockIcon from "@mui/icons-material/Lock";
import { useLanguage } from "../components/LanguageContext";
import { useDealer } from "../components/DealerContext";
import { useCart } from "../components/CartContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

// API URL
const API_URL = `${API_BASE_URL}/public`;

// Styled Components
const PageContainer = styled(Box)({
  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  paddingTop: "100px",
  paddingBottom: "60px",
});

const BgDecoration = styled(Box)(({ size, top, left, right, bottom, delay }) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.03)",
  top,
  left,
  right,
  bottom,
  animation: `float ${delay}s infinite ease-in-out`,
  "@keyframes float": {
    "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
    "33%": { transform: "translate(30px, -30px) rotate(120deg)" },
    "66%": { transform: "translate(-20px, 20px) rotate(240deg)" },
  },
}));

const Container = styled(Box)({
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 20px",
  position: "relative",
  zIndex: 10,
});

const Hero = styled(Box)({
  textAlign: "center",
  marginBottom: "50px",
  animation: "fadeInDown 0.8s ease-out",
  "@keyframes fadeInDown": {
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "& h1": {
    fontSize: "3.5rem",
    fontWeight: 800,
    color: "white",
    marginBottom: "16px",
    textShadow: "0 4px 20px rgba(0,0,0,0.1)",
    letterSpacing: "-1px",
    "@media (max-width: 768px)": {
      fontSize: "2.5rem",
    },
  },
  "& p": {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1.1rem",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
});

const StyledTabs = styled(Tabs)({
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: "16px",
  padding: "8px",
  marginBottom: "40px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  "& .MuiTabs-indicator": {
    background: "linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)",
    height: "3px",
    borderRadius: "3px",
  },
});

const StyledTab = styled(Tab)({
  fontSize: "1rem",
  fontWeight: 600,
  color: "#64748b",
  minHeight: "56px",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&.Mui-selected": {
    color: "#dc2626",
  },
  "&:hover": {
    color: "#b91c1c",
  },
  "& .icon": {
    marginRight: "8px",
    fontSize: "1.4rem",
  },
});

const CategoryDescription = styled(Box)({
  textAlign: "center",
  marginBottom: "40px",
  "& h5": {
    color: "white",
    fontWeight: 600,
    marginBottom: "8px",
    fontSize: "1.5rem",
  },
  "& p": {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: "1rem",
  },
});

const ProductsGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px",
  animation: "fadeIn 0.6s ease-out",
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const ProductCard = styled(Box)({
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 28px rgba(220, 38, 38, 0.2)",
    "& .product-image img": {
      transform: "scale(1.08)",
    },
  },
});

const ProductImage = styled(Box)({
  height: "220px",
  background: "#f8f9fa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "20px",
    transition: "transform 0.4s ease",
  },
  "& .placeholder-icon": {
    fontSize: "3.5rem",
    color: "#dc2626",
    opacity: 0.25,
  },
});

const ProductInfo = styled(Box)({
  padding: "20px",
});

const ProductTitle = styled(Typography)({
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "#1f2937",
  marginBottom: "8px",
  lineHeight: 1.3,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const ProductModel = styled(Typography)({
  fontSize: "0.875rem",
  color: "#dc2626",
  fontWeight: 600,
  marginBottom: "16px",
  display: "inline-block",
  padding: "4px 12px",
  backgroundColor: "#fee2e2",
  borderRadius: "6px",
});

const SpecsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  paddingTop: "12px",
  borderTop: "1px solid #f1f5f9",
});

const SpecItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "0.875rem",
  "& .label": {
    color: "#6b7280",
    fontWeight: 500,
  },
  "& .value": {
    color: "#1f2937",
    fontWeight: 600,
  },
});

const PriceBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #f1f5f9",
});

const PriceLabel = styled(Typography)({
  fontSize: "0.875rem",
  color: "#6b7280",
  fontWeight: 500,
});

const PriceValue = styled(Typography)({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "#dc2626",
});

const LoginLink = styled(Link)({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#dc2626",
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 600,
  transition: "opacity 0.2s",
  "&:hover": {
    opacity: 0.8,
  },
});

const EmptyState = styled(Box)({
  width: "100%",
  textAlign: "center",
  padding: "60px 20px",
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "400px",
});

const ErrorContainer = styled(Box)({
  textAlign: "center",
  color: "white",
  backgroundColor: "rgba(255,255,255,0.1)",
  padding: "40px",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
  marginBottom: "40px",
});

// Product data
const productsData = {
  tr: {
    categories: {
      kazan: {
        name: "Kazanlar",
        icon: <LocalFireDepartmentIcon />,
        description: "Yüksek verimli katı yakıtlı kalorifer kazanları",
      },
      kuzine: {
        name: "Kuzineler",
        icon: <WhatshotIcon />,
        description: "Isıtma ve pişirme amaçlı kuzine sobalar",
      },
      pellet: {
        name: "Pellet Sistemler",
        icon: <GrainIcon />,
        description: "Otomatik beslemeli pellet yakıtlı sistemler",
      },
    },
    viewDetails: "Detayları Görüntüle",
    price: "Fiyat",
    stock: "Stok",
    category: "Kategori",
    title: "Ürünlerimiz",
    subtitle: "Yüksek kaliteli ısıtma sistemleri ile konforlu yaşam alanları yaratıyoruz",
    loginForPrice: "Fiyatı görmek için giriş yapın",
    noProducts: "Bu kategoride henüz ürün bulunmamaktadır",
  },
  en: {
    categories: {
      kazan: {
        name: "Boilers",
        icon: <LocalFireDepartmentIcon />,
        description: "High efficiency solid fuel heating boilers",
      },
      kuzine: {
        name: "Stoves",
        icon: <WhatshotIcon />,
        description: "Heating and cooking stoves",
      },
      pellet: {
        name: "Pellet Systems",
        icon: <GrainIcon />,
        description: "Automatic feed pellet fuel systems",
      },
    },
    viewDetails: "View Details",
    price: "Price",
    stock: "Stock",
    category: "Category",
    title: "Our Products",
    subtitle: "Creating comfortable living spaces with high quality heating systems",
    loginForPrice: "Login to see price",
    noProducts: "No products found in this category",
  },
  ru: {
    categories: {
      kazan: {
        name: "Котлы",
        icon: <LocalFireDepartmentIcon />,
        description: "Высокоэффективные твердотопливные котлы",
      },
      kuzine: {
        name: "Печи",
        icon: <WhatshotIcon />,
        description: "Печи для отопления и приготовления пищи",
      },
      pellet: {
        name: "Пеллетные системы",
        icon: <GrainIcon />,
        description: "Системы с автоматической подачей пеллет",
      },
    },
    viewDetails: "Посмотреть детали",
    price: "Цена",
    stock: "Склад",
    category: "Категория",
    title: "Наша продукция",
    subtitle: "Создаем комфортные жилые помещения с помощью высококачественных систем отопления",
    loginForPrice: "Войдите, чтобы увидеть цену",
    noProducts: "В этой категории пока нет продуктов",
  },
};

function Urunlerimiz() {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, getAuthHeader } = useDealer();
  const { addToCart } = useCart();
  const t = productsData[currentLanguage] || productsData.tr;
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDealer, setIsDealer] = useState(false);

  const categories = Object.keys(t.categories);
  const activeCategory = categories[activeTab];
  const activeCategoryData = t.categories[activeCategory];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const headers = isAuthenticated ? getAuthHeader() : {};
        const response = await axios.get(`${API_URL}/products`, { headers });
        
        if (response.data.status === 'success') {
          setProducts(response.data.data.products);
          setIsDealer(response.data.data.is_dealer);
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [isAuthenticated, getAuthHeader]);

  // Ensure page opens at top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Map products to categories
  const getProductsByCategory = (categoryKey) => {
    const categoryMapping = {
      kazan: 1,
      kuzine: 2,
      pellet: 3
    };
    
    const categoryId = categoryMapping[categoryKey];
    return products.filter(product => product.category_id === categoryId);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDealer || !isAuthenticated) return;
    addToCart(product, 1);
  };

  return (
    <PageContainer>
      {/* Animated Background Elements */}
      <BgDecoration size="400px" top="-200px" left="-200px" delay={20} />
      <BgDecoration size="300px" bottom="-150px" right="-150px" delay={15} />
      <BgDecoration size="200px" top="40%" left="10%" delay={10} />

      <Container>
        {/* Hero Section */}
        <Hero>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </Hero>

        {/* Category Tabs */}
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          variant="fullWidth"
        >
          {categories.map((category) => (
            <StyledTab
              key={category}
              label={
                <Box display="flex" alignItems="center">
                  <span className="icon">{t.categories[category].icon}</span>
                  {t.categories[category].name}
                </Box>
              }
            />
          ))}
        </StyledTabs>

        {/* Category Description */}
        <CategoryDescription>
          <Typography variant="h5">{activeCategoryData.name}</Typography>
          <Typography>{activeCategoryData.description}</Typography>
        </CategoryDescription>

        {/* Loading State */}
        {loading && (
          <LoadingContainer>
            <CircularProgress sx={{ color: 'white' }} size={60} />
          </LoadingContainer>
        )}
        
        {/* Error State */}
        {error && (
          <ErrorContainer>
            <Typography variant="h6" sx={{ mb: 2 }}>{error}</Typography>
            <Button 
              variant="contained" 
              sx={{ bgcolor: 'white', color: '#dc2626', '&:hover': { bgcolor: '#f9fafb' } }}
              onClick={() => window.location.reload()}
            >
              Yenile
            </Button>
          </ErrorContainer>
        )}
        
        {/* Products Grid */}
        {!loading && !error && (
          <ProductsGrid>
            {getProductsByCategory(activeCategory).length > 0 ? (
              getProductsByCategory(activeCategory).map((product, index) => (
                <Link 
                  key={product.id}
                  to={`/urunlerimiz/${product.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <ProductCard style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProductImage className="product-image">
                      {(product.cover_photo || product.image) ? (
                        <img
                          src={product.cover_photo || product.image}
                          alt={product.name}
                        />
                      ) : (
                        <LocalFireDepartmentIcon className="placeholder-icon" />
                      )}
                    </ProductImage>
                    
                    <ProductInfo>
                      <ProductModel>Model: {product.model}</ProductModel>
                      <ProductTitle>{product.name}</ProductTitle>

                      {isDealer && isAuthenticated && product.price ? (
                        <PriceBox>
                          <PriceLabel>{t.price}</PriceLabel>
                          <PriceValue>
                            {Number(product.price || 0).toLocaleString("tr-TR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} ₺
                          </PriceValue>
                        </PriceBox>
                      ) : null}
                      {isDealer && isAuthenticated && product.price ? (
                        <Button
                          variant="contained"
                          color="error"
                          fullWidth
                          sx={{ mt: 2, borderRadius: 2, textTransform: "none" }}
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          Sepete Ekle
                        </Button>
                      ) : null}
                    </ProductInfo>
                  </ProductCard>
                </Link>
              ))
            ) : (
              <EmptyState>
                <LocalFireDepartmentIcon sx={{ fontSize: 60, color: 'white', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                  {t.noProducts}
                </Typography>
              </EmptyState>
            )}
          </ProductsGrid>
        )}
      </Container>
    </PageContainer>
  );
}

export default Urunlerimiz;