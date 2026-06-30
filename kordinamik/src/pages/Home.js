import React from "react";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { useLanguage } from "../components/LanguageContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import logoImage from "../assets/logo.png";
import kaliteImage from "../assets/kalite.jpeg";

// Styled Componentsont w
const PageContainer = styled(Box)({
  background: "#ffffff",
  minHeight: "100vh",
});

// Hero Section
const HeroSection = styled(Box)({
  background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
  minHeight: "90vh",
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  paddingTop: "80px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
  },
});

const HeroContent = styled(Box)({
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 20px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "60px",
  alignItems: "center",
  position: "relative",
  zIndex: 1,
  "@media (max-width: 968px)": {
    gridTemplateColumns: "1fr",
    gap: "40px",
    textAlign: "center",
  },
});

const HeroTextContent = styled(Box)({
  color: "white",
  animation: "fadeInUp 0.9s ease-out",
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
});

const HeroTitle = styled("h1")({
  fontSize: "4rem",
  fontWeight: 800,
  lineHeight: 1.1,
  marginBottom: "30px",
  color: "white",
  textShadow: "0 4px 20px rgba(0,0,0,0.2)",
  "@media (max-width: 968px)": {
    fontSize: "2.5rem",
  },
  "@media (max-width: 480px)": {
    fontSize: "2rem",
  },
});

const HeroSubtitle = styled("p")({
  fontSize: "1.3rem",
  lineHeight: 1.6,
  marginBottom: "40px",
  color: "rgba(255, 255, 255, 0.95)",
  "@media (max-width: 968px)": {
    fontSize: "1.1rem",
  },
});

const HeroButtons = styled(Box)({
  display: "flex",
  gap: "20px",
  "@media (max-width: 968px)": {
    justifyContent: "center",
  },
  "@media (max-width: 480px)": {
    flexDirection: "column",
  },
});

const PrimaryButton = styled(Link)({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "18px 35px",
  background: "white",
  color: "#dc2626",
  fontSize: "1.1rem",
  fontWeight: 700,
  borderRadius: "50px",
  textDecoration: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
  },
});

const SecondaryButton = styled(Link)({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "18px 35px",
  background: "rgba(255, 255, 255, 0.15)",
  color: "white",
  fontSize: "1.1rem",
  fontWeight: 700,
  borderRadius: "50px",
  textDecoration: "none",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.25)",
    transform: "translateY(-3px)",
  },
});

const HeroImageContainer = styled(Box)({
  position: "relative",
  animation: "fadeIn 1s ease-out",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (max-width: 968px)": {
    maxWidth: "500px",
    margin: "0 auto",
  },
  "& img": {
    width: "100%",
    height: "auto",
    borderRadius: "30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
});

// Stats Section
const StatsSection = styled(Box)({
  background: "white",
  padding: "80px 20px",
  marginTop: "-80px",
  position: "relative",
  zIndex: 2,
});

const StatsContainer = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
  background: "white",
  borderRadius: "30px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  padding: "60px 40px",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "40px",
  "@media (max-width: 968px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "30px",
    padding: "40px 30px",
  },
  "@media (max-width: 480px)": {
    gridTemplateColumns: "1fr",
  },
});

const StatItem = styled(Box)({
  textAlign: "center",
  "& .number": {
    fontSize: "3rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "10px",
  },
  "& .label": {
    fontSize: "1rem",
    color: "#666666",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
});

// Features Section
const FeaturesSection = styled(Box)({
  padding: "100px 20px",
  background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
});

const SectionTitle = styled("h2")({
  fontSize: "3rem",
  fontWeight: 800,
  textAlign: "center",
  marginBottom: "20px",
  color: "#333333",
  "@media (max-width: 768px)": {
    fontSize: "2rem",
  },
});

const SectionSubtitle = styled("p")({
  fontSize: "1.2rem",
  textAlign: "center",
  color: "#666666",
  marginBottom: "60px",
  maxWidth: "700px",
  margin: "0 auto 60px",
});

const FeaturesGrid = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "30px",
  "@media (max-width: 968px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  "@media (max-width: 480px)": {
    gridTemplateColumns: "1fr",
  },
});

const FeatureCard = styled(Box)({
  background: "white",
  padding: "40px 30px",
  borderRadius: "25px",
  textAlign: "center",
  transition: "all 0.4s ease",
  border: "2px solid transparent",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  "&:hover": {
    transform: "translateY(-10px)",
    borderColor: "#dc2626",
    boxShadow: "0 20px 50px rgba(220, 38, 38, 0.15)",
    "& .icon": {
      transform: "scale(1.1)",
      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
      color: "white",
    },
  },
});

const FeatureIcon = styled(Box)({
  width: "80px",
  height: "80px",
  margin: "0 auto 25px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.4s ease",
  "& svg": {
    fontSize: "40px",
    color: "#dc2626",
    transition: "color 0.4s ease",
  },
});

const FeatureTitle = styled("h3")({
  fontSize: "1.3rem",
  fontWeight: 700,
  color: "#333333",
  marginBottom: "15px",
});

const FeatureDescription = styled("p")({
  fontSize: "0.95rem",
  color: "#666666",
  lineHeight: "1.6",
});

// About Section
const AboutSection = styled(Box)({
  padding: "100px 20px",
  background: "white",
});

const AboutContent = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "60px",
  alignItems: "center",
  "@media (max-width: 968px)": {
    gridTemplateColumns: "1fr",
    gap: "40px",
  },
});

const AboutImageContainer = styled(Box)({
  "& img": {
    width: "100%",
    height: "auto",
    borderRadius: "30px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
});

const AboutText = styled(Box)({
  "& h2": {
    fontSize: "3rem",
    fontWeight: 800,
    marginBottom: "25px",
    color: "#333333",
    "@media (max-width: 768px)": {
      fontSize: "2rem",
    },
  },
  "& p": {
    fontSize: "1.1rem",
    color: "#666666",
    lineHeight: "1.8",
    marginBottom: "20px",
  },
});

const CheckList = styled(Box)({
  marginTop: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
});

const CheckItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  "& svg": {
    color: "#dc2626",
    fontSize: "28px",
  },
  "& span": {
    fontSize: "1.1rem",
    color: "#333333",
    fontWeight: 600,
  },
});

// CTA Section
const CTASection = styled(Box)({
  background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
  padding: "100px 20px",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
  },
});

const CTAContent = styled(Box)({
  maxWidth: "800px",
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
  "& h2": {
    fontSize: "3rem",
    fontWeight: 800,
    color: "white",
    marginBottom: "25px",
    "@media (max-width: 768px)": {
      fontSize: "2rem",
    },
  },
  "& p": {
    fontSize: "1.3rem",
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: "40px",
    "@media (max-width: 768px)": {
      fontSize: "1.1rem",
    },
  },
});

const CTAButtons = styled(Box)({
  display: "flex",
  gap: "20px",
  justifyContent: "center",
  "@media (max-width: 480px)": {
    flexDirection: "column",
    alignItems: "center",
  },
});

// Translations
const translations = {
  tr: {
    hero: {
      title: "Kaliteli Isı Sistemleri",
      subtitle: "11 yıllık tecrübemizle, en son teknoloji ile üretilen katı yakıtlı kalorifer kazanları ve ısı sistemleri çözümleri sunuyoruz.",
      primaryButton: "Ürünlerimizi İnceleyin",
      secondaryButton: "Biz Kimiz",
    },
    stats: {
      established: "Kuruluş Yılı",
      area: "Kapalı Alan",
      products: "Ürün Çeşidi",
      experience: "Yıl Deneyim",
    },
    features: {
      title: "Neden Bizi Seçmelisiniz?",
      subtitle: "Müşterilerimize en iyi hizmeti sunmak için sürekli kendimizi geliştiriyoruz",
      quality: {
        title: "Yüksek Kalite",
        description: "Dünya standartlarında kaliteli ürün üretimi",
      },
      shipping: {
        title: "Hızlı Teslimat",
        description: "Türkiye geneline hızlı ve güvenli teslimat",
      },
      warranty: {
        title: "Garantili Ürünler",
        description: "Tüm ürünlerimizde uzun süreli garanti",
      },
      support: {
        title: "7/24 Destek",
        description: "Müşteri memnuniyeti odaklı destek hizmeti",
      },
    },
    about: {
      title: "Kordinamik Isı Sistemleri",
      description1: "2013 yılında Isparta'da kurulan firmamız, 2500m² kapalı alanda hizmet vermektedir. Yüksek nitelikli uzmanlarımız ile dünya standartlarına göre kaliteli ürünler üretiyoruz.",
      description2: "Katı yakıtlı kalorifer kazanları konusunda uzman kadromuz, en son yüksek teknoloji ile ürünler geliştirmektedir.",
      check1: "11+ Yıllık Deneyim",
      check2: "Dünya Standartlarında Üretim",
      check3: "Müşteri Memnuniyeti Odaklı",
      check4: "Sürekli Ar-Ge Çalışmaları",
      learnMore: "Daha Fazla Bilgi",
    },
    cta: {
      title: "Projeleriniz İçin Bizimle İletişime Geçin",
      subtitle: "Ürünlerimiz ve hizmetlerimiz hakkında detaylı bilgi almak için bize ulaşın",
      contact: "İletişime Geçin",
      products: "Ürünleri Görüntüle",
    },
  },
  en: {
    hero: {
      title: "Quality Heating Systems",
      subtitle: "With 11 years of experience, we offer solid fuel boilers and heating system solutions produced with the latest technology.",
      primaryButton: "View Our Products",
      secondaryButton: "About Us",
    },
    stats: {
      established: "Established",
      area: "Indoor Area",
      products: "Product Types",
      experience: "Years Experience",
    },
    features: {
      title: "Why Choose Us?",
      subtitle: "We continuously improve ourselves to provide the best service to our customers",
      quality: {
        title: "High Quality",
        description: "World-standard quality product manufacturing",
      },
      shipping: {
        title: "Fast Delivery",
        description: "Fast and secure delivery throughout Turkey",
      },
      warranty: {
        title: "Warranted Products",
        description: "Long-term warranty on all our products",
      },
      support: {
        title: "24/7 Support",
        description: "Customer satisfaction focused support service",
      },
    },
    about: {
      title: "Kordinamik Heating Systems",
      description1: "Founded in Isparta in 2013, our company serves in a 2500m² indoor area. We produce quality products according to world standards with our highly qualified experts.",
      description2: "Our expert team in solid fuel boilers develops products with the latest high technology.",
      check1: "11+ Years of Experience",
      check2: "World Standard Production",
      check3: "Customer Satisfaction Focused",
      check4: "Continuous R&D Studies",
      learnMore: "Learn More",
    },
    cta: {
      title: "Contact Us for Your Projects",
      subtitle: "Contact us for detailed information about our products and services",
      contact: "Get in Touch",
      products: "View Products",
    },
  },
  ru: {
    hero: {
      title: "Качественные системы отопления",
      subtitle: "С 11-летним опытом мы предлагаем котлы на твердом топливе и решения для систем отопления, произведенные по последним технологиям.",
      primaryButton: "Просмотреть продукты",
      secondaryButton: "О нас",
    },
    stats: {
      established: "Основан",
      area: "Крытая площадь",
      products: "Видов продукции",
      experience: "Лет опыта",
    },
    features: {
      title: "Почему выбирают нас?",
      subtitle: "Мы постоянно совершенствуемся, чтобы предоставить лучший сервис нашим клиентам",
      quality: {
        title: "Высокое качество",
        description: "Производство продукции мирового стандарта",
      },
      shipping: {
        title: "Быстрая доставка",
        description: "Быстрая и безопасная доставка по всей Турции",
      },
      warranty: {
        title: "Гарантированные продукты",
        description: "Долгосрочная гарантия на всю нашу продукцию",
      },
      support: {
        title: "Поддержка 24/7",
        description: "Служба поддержки, ориентированная на удовлетворение клиентов",
      },
    },
    about: {
      title: "Системы отопления Kordinamik",
      description1: "Наша компания, основанная в Испарте в 2013 году, работает на крытой площади 2500м². Мы производим качественную продукцию в соответствии с мировыми стандартами с нашими высококвалифицированными специалистами.",
      description2: "Наша команда экспертов по котлам на твердом топливе разрабатывает продукцию с использованием новейших высоких технологий.",
      check1: "11+ лет опыта",
      check2: "Производство мирового стандарта",
      check3: "Ориентация на удовлетворение клиентов",
      check4: "Постоянные исследования и разработки",
      learnMore: "Узнать больше",
    },
    cta: {
      title: "Свяжитесь с нами по вашим проектам",
      subtitle: "Свяжитесь с нами для получения подробной информации о наших продуктах и услугах",
      contact: "Связаться",
      products: "Просмотреть продукты",
    },
  },
};

function Home() {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.tr;

  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTextContent>
            <HeroTitle>{t.hero.title}</HeroTitle>
            <HeroSubtitle>{t.hero.subtitle}</HeroSubtitle>
            <HeroButtons>
              <PrimaryButton to="/urunlerimiz">
                {t.hero.primaryButton}
                <ArrowForwardIcon />
              </PrimaryButton>
              <SecondaryButton to="/biz-kimiz">
                {t.hero.secondaryButton}
              </SecondaryButton>
            </HeroButtons>
          </HeroTextContent>
          <HeroImageContainer>
            <img src={kaliteImage} alt="Kordinamik Factory" />
          </HeroImageContainer>
        </HeroContent>
      </HeroSection>

      {/* Stats Section */}
      <StatsSection>
        <StatsContainer>
          <StatItem>
            <div className="number">2013</div>
            <div className="label">{t.stats.established}</div>
          </StatItem>
          <StatItem>
            <div className="number">2500m²</div>
            <div className="label">{t.stats.area}</div>
          </StatItem>
          <StatItem>
            <div className="number">11</div>
            <div className="label">{t.stats.products}</div>
          </StatItem>
          <StatItem>
            <div className="number">11+</div>
            <div className="label">{t.stats.experience}</div>
          </StatItem>
        </StatsContainer>
      </StatsSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>{t.features.title}</SectionTitle>
        <SectionSubtitle>{t.features.subtitle}</SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon className="icon">
              <EmojiEventsIcon />
            </FeatureIcon>
            <FeatureTitle>{t.features.quality.title}</FeatureTitle>
            <FeatureDescription>{t.features.quality.description}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon className="icon">
              <LocalShippingIcon />
            </FeatureIcon>
            <FeatureTitle>{t.features.shipping.title}</FeatureTitle>
            <FeatureDescription>{t.features.shipping.description}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon className="icon">
              <VerifiedUserIcon />
            </FeatureIcon>
            <FeatureTitle>{t.features.warranty.title}</FeatureTitle>
            <FeatureDescription>{t.features.warranty.description}</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon className="icon">
              <SupportAgentIcon />
            </FeatureIcon>
            <FeatureTitle>{t.features.support.title}</FeatureTitle>
            <FeatureDescription>{t.features.support.description}</FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* About Section */}
      <AboutSection>
        <AboutContent>
          <AboutImageContainer>
            <img src={logoImage} alt="Kordinamik Logo" />
          </AboutImageContainer>
          <AboutText>
            <h2>{t.about.title}</h2>
            <p>{t.about.description1}</p>
            <p>{t.about.description2}</p>
            <CheckList>
              <CheckItem>
                <CheckCircleIcon />
                <span>{t.about.check1}</span>
              </CheckItem>
              <CheckItem>
                <CheckCircleIcon />
                <span>{t.about.check2}</span>
              </CheckItem>
              <CheckItem>
                <CheckCircleIcon />
                <span>{t.about.check3}</span>
              </CheckItem>
              <CheckItem>
                <CheckCircleIcon />
                <span>{t.about.check4}</span>
              </CheckItem>
            </CheckList>
            <Box sx={{ marginTop: "30px" }}>
              <PrimaryButton to="/biz-kimiz" style={{ background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", color: "white" }}>
                {t.about.learnMore}
                <ArrowForwardIcon />
              </PrimaryButton>
            </Box>
          </AboutText>
        </AboutContent>
      </AboutSection>

      {/* CTA Section */}
      <CTASection>
        <CTAContent>
          <h2>{t.cta.title}</h2>
          <p>{t.cta.subtitle}</p>
          <CTAButtons>
            <PrimaryButton to="/iletisim">
              {t.cta.contact}
              <ArrowForwardIcon />
            </PrimaryButton>
            <SecondaryButton to="/urunlerimiz">
              {t.cta.products}
            </SecondaryButton>
          </CTAButtons>
        </CTAContent>
      </CTASection>
    </PageContainer>
  );
}

export default Home;

