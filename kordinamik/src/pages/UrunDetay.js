import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress, styled, Tabs, Tab, Button, TextField } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useLanguage } from "../components/LanguageContext";
import { useDealer } from "../components/DealerContext";
import { useCart } from "../components/CartContext";
import axios from "axios";
import { API_BASE_URL } from "../config";

// API URL
const API_URL = `${API_BASE_URL}/public`;

// Styled Components
const PageContainer = styled(Box)({
  backgroundColor: "#fafafa",
  minHeight: "100vh",
  paddingTop: "100px",
  paddingBottom: "40px",
});

const Container = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
  "@media (max-width: 768px)": {
    padding: "0 16px",
  },
});

const ProductSection = styled(Box)({
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  marginBottom: "24px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
});

const MainImageContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "350px",
  backgroundColor: "#f8f9fa",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "@media (max-width: 768px)": {
    height: "280px",
  },
});

const MainImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "contain",
  padding: "20px",
});

const ThumbnailGrid = styled(Box)({
  display: "flex",
  gap: "8px",
  padding: "16px",
  overflowX: "auto",
  justifyContent: "center",
  "&::-webkit-scrollbar": {
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#dc2626",
    borderRadius: "3px",
  },
});

const ThumbnailBox = styled(Box)(({ active }) => ({
  width: "70px",
  height: "70px",
  minWidth: "70px",
  borderRadius: "8px",
  overflow: "hidden",
  cursor: "pointer",
  border: active ? "2px solid #dc2626" : "2px solid #e5e7eb",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "#dc2626",
    transform: "translateY(-2px)",
  },
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const InfoSection = styled(Box)({
  padding: "24px",
  "@media (max-width: 768px)": {
    padding: "20px 16px",
  },
});

const ProductTitle = styled(Typography)({
  fontSize: "1.75rem",
  fontWeight: 700,
  color: "#1f2937",
  marginBottom: "8px",
  lineHeight: 1.3,
  "@media (max-width: 768px)": {
    fontSize: "1.5rem",
  },
});

const ProductModel = styled(Typography)({
  fontSize: "1rem",
  color: "#dc2626",
  fontWeight: 600,
  marginBottom: "16px",
});

const TabsSection = styled(Box)({
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
});

const StyledTabs = styled(Tabs)({
  borderBottom: "1px solid #e5e7eb",
  minHeight: "48px",
  "& .MuiTabs-indicator": {
    backgroundColor: "#dc2626",
    height: "3px",
  },
});

const StyledTab = styled(Tab)({
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "none",
  minHeight: "48px",
  padding: "12px 24px",
  "&.Mui-selected": {
    color: "#dc2626",
  },
  "&:hover": {
    color: "#374151",
  },
  "@media (max-width: 768px)": {
    fontSize: "0.875rem",
    padding: "12px 16px",
  },
});

const TabContent = styled(Box)({
  padding: "24px",
  "@media (max-width: 768px)": {
    padding: "20px 16px",
  },
});

const DescriptionText = styled(Typography)({
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "#4b5563",
  marginBottom: "20px",
  whiteSpace: "pre-line",
});

const SpecTable = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  backgroundColor: "#e5e7eb",
  borderRadius: "8px",
  overflow: "hidden",
  marginTop: "16px",
});

const SpecRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: "140px 1fr",
  backgroundColor: "#ffffff",
  "&:hover": {
    backgroundColor: "#f9fafb",
  },
  "@media (max-width: 768px)": {
    gridTemplateColumns: "120px 1fr",
  },
});

const SpecLabel = styled(Typography)({
  padding: "12px 16px",
  fontSize: "0.875rem",
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  "@media (max-width: 768px)": {
    padding: "10px 12px",
    fontSize: "0.8rem",
  },
});

const SpecValue = styled(Typography)({
  padding: "12px 16px",
  fontSize: "0.95rem",
  fontWeight: 500,
  color: "#1f2937",
  "@media (max-width: 768px)": {
    padding: "10px 12px",
    fontSize: "0.875rem",
  },
});

const TechnicalImageContainer = styled(Box)({
  width: "100%",
  maxWidth: "900px",
  margin: "0 auto",
  "@media (max-width: 768px)": {
    maxWidth: "100%",
  },
});

const TechnicalImage = styled("img")({
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
});

const EmptyState = styled(Box)({
  textAlign: "center",
  padding: "60px 20px",
  color: "#9ca3af",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
});

const ErrorContainer = styled(Box)({
  textAlign: "center",
  padding: "60px 20px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
});

function UrunDetay() {
  const { id } = useParams();
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, getAuthHeader } = useDealer();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isDealer, setIsDealer] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const showPrice = isDealer && isAuthenticated && product?.price;
  // Translations
  const t = {
    tr: {
      model: "Model",
      category: "Kategori",
      notFound: "Ürün bulunamadı",
      error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      features: "Özellikler & Açıklama",
      technicalDetails: "Teknik Detaylar",
      comingSoon: "Teknik detaylar yakında eklenecektir.",
    },
    en: {
      model: "Model",
      category: "Category",
      notFound: "Product not found",
      error: "An error occurred. Please try again later.",
      features: "Features & Description",
      technicalDetails: "Technical Details",
      comingSoon: "Technical details will be added soon.",
    },
    ru: {
      model: "Модель",
      category: "Категория",
      notFound: "Товар не найден",
      error: "Произошла ошибка. Пожалуйста, повторите попытку позже.",
      features: "Особенности и описание",
      technicalDetails: "Технические детали",
      comingSoon: "Технические детали будут добавлены в ближайшее время.",
    },
  }[currentLanguage] || t.tr;

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const headers = isAuthenticated ? getAuthHeader() : {};
        const response = await axios.get(`${API_URL}/products/${id}`, { headers });
        
        if (response.data.status === "success") {
          setProduct(response.data.data);
          setIsDealer(response.data.data.is_dealer);
          setActiveImage(0);
        } else {
          throw new Error("Failed to fetch product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.status === 404 ? t.notFound : t.error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, isAuthenticated, getAuthHeader, t.notFound, t.error]);

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddToCart = () => {
    if (!product || !showPrice) return;
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <LoadingContainer>
            <CircularProgress sx={{ color: "#dc2626" }} size={50} thickness={4} />
          </LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <Container>
          <ErrorContainer>
            <Typography variant="h5" sx={{ color: "#dc2626", fontWeight: 600 }}>
              {error || t.notFound}
            </Typography>
          </ErrorContainer>
        </Container>
      </PageContainer>
    );
  }

  // Exclude cover/primary image from the gallery on the detail page
  const galleryImages = product.images?.filter((img) => !img.is_primary) || [];

  const currentImage = galleryImages.length > 0
    ? galleryImages[activeImage]?.image_url
    : null;

  return (
    <PageContainer>
      <Container>
        <ProductSection>
          <Grid container spacing={0}>
            {/* Image Section */}
            <Grid item xs={12} md={5}>
              <MainImageContainer>
                {currentImage ? (
                  <MainImage src={currentImage} alt={product.name} />
                ) : (
                  <LocalFireDepartmentIcon
                    sx={{ fontSize: 80, color: "#dc2626", opacity: 0.2 }}
                  />
                )}
              </MainImageContainer>

              {galleryImages.length > 1 && (
                <ThumbnailGrid>
                  {galleryImages.map((img, index) => (
                    <ThumbnailBox
                      key={index}
                      active={index === activeImage}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img src={img.image_url} alt={`${product.name} - ${index + 1}`} />
                    </ThumbnailBox>
                  ))}
                </ThumbnailGrid>
              )}
            </Grid>

            {/* Info Section */}
            <Grid item xs={12} md={7}>
              <InfoSection>
                <ProductModel>{product.model}</ProductModel>
                <ProductTitle>{product.name}</ProductTitle>
                {showPrice ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#dc2626" }}>
                      {Number(product.price || 0).toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ₺
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
                      <TextField
                        type="number"
                        label="Adet"
                        size="small"
                        inputProps={{ min: 1 }}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        sx={{ width: 120 }}
                      />
                      <Button variant="contained" color="error" onClick={handleAddToCart}>
                        Sepete Ekle
                      </Button>
                    </Box>
                  </Box>
                ) : null}
              </InfoSection>
            </Grid>
          </Grid>
        </ProductSection>

        {/* Tabs Section */}
        <TabsSection>
          <StyledTabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <StyledTab label={t.features} />
            <StyledTab label={t.technicalDetails} />
          </StyledTabs>

          {/* Features Tab */}
          {activeTab === 0 && (
            <TabContent>
              {product.description && (
                <DescriptionText>
                  {product.description}
                </DescriptionText>
              )}

              <SpecTable>
                <SpecRow>
                  <SpecLabel>{t.model}</SpecLabel>
                  <SpecValue>{product.model}</SpecValue>
                </SpecRow>
                {product.category && (
                  <SpecRow>
                    <SpecLabel>{t.category}</SpecLabel>
                    <SpecValue>{product.category}</SpecValue>
                  </SpecRow>
                )}
              </SpecTable>
            </TabContent>
          )}

          {/* Technical Details Tab */}
          {activeTab === 1 && (
            <TabContent>
              {product.technical_details_image ? (
                <TechnicalImageContainer>
                  <TechnicalImage
                    src={product.technical_details_image}
                    alt="Technical Details"
                  />
                </TechnicalImageContainer>
              ) : (
                <EmptyState>
                  <LocalFireDepartmentIcon sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t.comingSoon}
                  </Typography>
                </EmptyState>
              )}
            </TabContent>
          )}
        </TabsSection>
      </Container>
    </PageContainer>
  );
}

export default UrunDetay;