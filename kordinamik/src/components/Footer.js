import React from "react";
import { Box, styled } from "@mui/material";
import { Link } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useLanguage } from "./LanguageContext";
import logoImage from "../assets/logo.png";

// Styled Components
const FooterContainer = styled(Box)({
  background: "linear-gradient(135deg, #0c0b0bff 0%, #991b1b 100%)",
  color: "white",
  marginTop: "auto",
});

const FooterContent = styled(Box)({
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "60px 20px 30px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "40px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
    gap: "30px",
    padding: "40px 20px 20px",
  },
});

const FooterSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
});

const FooterTitle = styled("h3")({
  fontSize: "1.3rem",
  fontWeight: 700,
  marginBottom: "10px",
  color: "white",
  letterSpacing: "0.5px",
});

const FooterLink = styled(Link)({
  color: "rgba(255, 255, 255, 0.85)",
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "&:hover": {
    color: "white",
    transform: "translateX(5px)",
  },
});

const FooterText = styled("p")({
  color: "rgba(255, 255, 255, 0.85)",
  fontSize: "0.95rem",
  lineHeight: "1.6",
  margin: "0",
});

const ContactItem = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  color: "rgba(255, 255, 255, 0.85)",
  fontSize: "0.95rem",
  lineHeight: "1.6",
  "& svg": {
    marginTop: "2px",
    fontSize: "20px",
  },
});

const SocialIcons = styled(Box)({
  display: "flex",
  gap: "15px",
  marginTop: "10px",
});

const SocialIcon = styled("a")({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  transition: "all 0.3s ease",
  textDecoration: "none",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-3px)",
  },
});

const FooterBottom = styled(Box)({
  borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "20px",
  textAlign: "center",
  marginTop: "40px",
  "@media (max-width: 768px)": {
    marginTop: "30px",
  },
});

const CopyrightText = styled("p")({
  color: "rgba(255, 255, 255, 0.85)",
  fontSize: "0.9rem",
  margin: "0",
});

const LogoContainer = styled(Box)({
  marginBottom: "20px",
  "& img": {
    height: "60px",
    width: "auto",
    objectFit: "contain",
  },
});

// Footer translations
const footerTranslations = {
  tr: {
    aboutCompany: "Şirket Hakkında",
    aboutText: "2013 yılından bu yana kaliteli ısı sistemleri üretimi konusunda uzmanlaşmış, Isparta merkezli bir firmayız.",
    quickLinks: "Hızlı Bağlantılar",
    home: "Ana Sayfa",
    products: "Ürünlerimiz",
    about: "Biz Kimiz",
    quality: "Kalite",
    contact: "İletişim",
    contactInfo: "İletişim Bilgileri",
    address: "Vatan O.S.B. Mah. 305. Cad. No:13/1 Merkez/Isparta",
    followUs: "Bizi Takip Edin",
    allRightsReserved: "Tüm hakları saklıdır.",
  },
  en: {
    aboutCompany: "About Company",
    aboutText: "Since 2013, we are an Isparta-based company specialized in the production of quality heating systems.",
    quickLinks: "Quick Links",
    home: "Home",
    products: "Products",
    about: "About Us",
    quality: "Quality",
    contact: "Contact",
    contactInfo: "Contact Information",
    address: "Vatan O.S.B. Mah. 305. Cad. No:13/1 Merkez/Isparta",
    followUs: "Follow Us",
    allRightsReserved: "All rights reserved.",
  },
  ru: {
    aboutCompany: "О компании",
    aboutText: "С 2013 года мы являемся компанией, базирующейся в Испарте, специализирующейся на производстве качественных систем отопления.",
    quickLinks: "Быстрые ссылки",
    home: "Главная",
    products: "Продукты",
    about: "О нас",
    quality: "Качество",
    contact: "Контакты",
    contactInfo: "Контактная информация",
    address: "Vatan O.S.B. Mah. 305. Cad. No:13/1 Merkez/Isparta",
    followUs: "Подпишитесь на нас",
    allRightsReserved: "Все права защищены.",
  },
};

function Footer() {
  const { currentLanguage } = useLanguage();
  const t = footerTranslations[currentLanguage] || footerTranslations.tr;
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        {/* Company Info Section */}
        <FooterSection>
          <LogoContainer>
            <img src={logoImage} alt="Kordinamik Logo" />
          </LogoContainer>
          <FooterTitle>{t.aboutCompany}</FooterTitle>
          <FooterText>{t.aboutText}</FooterText>
          <SocialIcons>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterIcon />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/kordinamik_kazan/" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </SocialIcon>
          </SocialIcons>
        </FooterSection>

        {/* Quick Links Section */}
        <FooterSection>
          <FooterTitle>{t.quickLinks}</FooterTitle>
          <FooterLink to="/">{t.home}</FooterLink>
          <FooterLink to="/urunlerimiz">{t.products}</FooterLink>
          <FooterLink to="/biz-kimiz">{t.about}</FooterLink>
          <FooterLink to="/kalite">{t.quality}</FooterLink>
          <FooterLink to="/iletisim">{t.contact}</FooterLink>
        </FooterSection>

        {/* Contact Info Section */}
        <FooterSection>
          <FooterTitle>{t.contactInfo}</FooterTitle>
          <ContactItem>
            <LocationOnIcon />
            <span>{t.address}</span>
          </ContactItem>
          <ContactItem>
            <PhoneIcon />
            <Box>
              <div>Tel: +90 246 222 20 90</div>
              <div>Fax: +90 246 222 20 91</div>
            </Box>
          </ContactItem>
          <ContactItem>
            <EmailIcon />
            <Box>
              <div>info@kordinamik.com</div>
              <div>export@kordinamik.com</div>
            </Box>
          </ContactItem>
        </FooterSection>
      </FooterContent>

      {/* Footer Bottom */}
      <FooterBottom>
        <CopyrightText>
          © {currentYear} Kordinamik Isı Sistemleri San. ve Tic. Ltd. Şti. {t.allRightsReserved}
        </CopyrightText>
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;

