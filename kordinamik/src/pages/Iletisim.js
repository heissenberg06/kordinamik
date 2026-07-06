import React from "react";
import { Box, styled } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useLanguage } from "../components/LanguageContext";

// Styled Components
const PageContainer = styled(Box)({
  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  paddingTop: "80px",
});

const BgDecoration = styled(Box)(({ size, top, left, right, bottom, delay }) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: "rgba(220, 220, 220, 0.3)",
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
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px 40px",
  position: "relative",
  zIndex: 10,
});

const Hero = styled(Box)({
  textAlign: "center",
  marginBottom: "60px",
  animation: "fadeInDown 0.8s ease-out",
  "@keyframes fadeInDown": {
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "& h1": {
    fontSize: "4rem",
    fontWeight: 800,
    color: "#333333",
    marginBottom: "20px",
    textShadow: "0 4px 20px rgba(0,0,0,0.05)",
    letterSpacing: "-1px",
    "@media (max-width: 768px)": {
      fontSize: "2.5rem",
    },
  },
  "& p": {
    color: "#666666",
    fontSize: "1.2rem",
    maxWidth: "600px",
    margin: "0 auto",
  },
});

const CardsContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
  gap: "30px",
  marginBottom: "60px",
  "@media (max-width: 1024px)": {
    gridTemplateColumns: "1fr",
  },
});

const GlassCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "30px",
  padding: "40px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  animation: "fadeInUp 1s ease-out",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
  },
  "@media (max-width: 768px)": {
    padding: "30px 20px",
  },
});

const CardTitle = styled("h2")({
  fontSize: "1.8rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #555555 0%, #333333 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "30px",
});

const FormRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginBottom: "25px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const StyledInput = styled("input")({
  width: "100%",
  padding: "15px 20px",
  border: "2px solid #e2e8f0",
  borderRadius: "15px",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  background: "white",
  color: "#334155",
  fontFamily: "inherit",
  boxSizing: "border-box",
  "&:focus": {
    outline: "none",
    borderColor: "#dc2626",
    boxShadow: "0 0 0 4px rgba(220, 38, 38, 0.1)",
  },
});

const StyledTextarea = styled("textarea")({
  width: "100%",
  padding: "15px 20px",
  border: "2px solid #e2e8f0",
  borderRadius: "15px",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  background: "white",
  color: "#334155",
  fontFamily: "inherit",
  resize: "vertical",
  minHeight: "120px",
  boxSizing: "border-box",
  "&:focus": {
    outline: "none",
    borderColor: "#dc2626",
    boxShadow: "0 0 0 4px rgba(220, 38, 38, 0.1)",
  },
});

const StyledLabel = styled("label")({
  display: "block",
  color: "#64748b",
  fontSize: "0.9rem",
  fontWeight: 600,
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

const FormGroup = styled(Box)({
  marginBottom: "25px",
});

const SubmitButton = styled("button")({
  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  color: "#ffffff",
  border: "none",
  padding: "18px 50px",
  fontSize: "1.1rem",
  fontWeight: 600,
  borderRadius: "50px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  textTransform: "uppercase",
  letterSpacing: "1px",
  width: "100%",
  marginTop: "10px",
  animation: "floatButton 3s ease-in-out infinite",
  "@keyframes floatButton": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-5px)" },
  },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
  },
});

const InfoItem = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "30px",
  padding: "20px",
  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
  borderRadius: "20px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateX(10px)",
    boxShadow: "0 5px 15px rgba(220, 38, 38, 0.1)",
  },
});

const InfoIcon = styled(Box)({
  width: "50px",
  height: "50px",
  background: "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
  borderRadius: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "20px",
  flexShrink: 0,
  "& svg": {
    color: "#555555",
    fontSize: "24px",
  },
});

const MapSection = styled(Box)({
  marginTop: "80px",
  position: "relative",
  borderRadius: "30px",
  overflow: "hidden",
  height: "500px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  animation: "fadeIn 1.2s ease-out",
  "@media (max-width: 768px)": {
    height: "280px",
    marginTop: "40px",
    borderRadius: "16px",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const MapOverlay = styled(Box)({
  position: "absolute",
  top: "30px",
  left: "30px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  padding: "20px 30px",
  borderRadius: "20px",
  zIndex: 1,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  "& h3": {
    color: "#1e293b",
    fontSize: "1.3rem",
    margin: 0,
  },
  "& p": {
    color: "#64748b",
    margin: "5px 0 0 0",
  },
});

const contactTranslations = {
  tr: {
    title: "Bize Ulaşın",
    subtitle: "Sorularınız ve projeleriniz için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.",
    sendMessage: "Mesaj Gönderin",
    name: "Adınız",
    email: "E-posta",
    subject: "Konu",
    message: "Mesajınız",
    submit: "Gönder",
    contactInfo: "İletişim Bilgileri",
    address: "Adres",
    phone: "Telefon",
    factoryLocation: "Fabrika Konumu",
    location: "Isparta, Türkiye",
  },
  en: {
    title: "Contact Us",
    subtitle: "Get in touch for your questions and projects. We will respond as soon as possible.",
    sendMessage: "Send Message",
    name: "Your Name",
    email: "Email",
    subject: "Subject",
    message: "Your Message",
    submit: "Send",
    contactInfo: "Contact Information",
    address: "Address",
    phone: "Phone",
    factoryLocation: "Factory Location",
    location: "Isparta, Türkiye",
  },
  ru: {
    title: "Свяжитесь с нами",
    subtitle: "Свяжитесь с нами по вопросам и проектам. Мы ответим как можно скорее.",
    sendMessage: "Отправить сообщение",
    name: "Ваше имя",
    email: "Электронная почта",
    subject: "Тема",
    message: "Ваше сообщение",
    submit: "Отправить",
    contactInfo: "Контактная информация",
    address: "Адрес",
    phone: "Телефон",
    factoryLocation: "Расположение завода",
    location: "Испарта, Турция",
  },
};

function Iletisim() {
  const { currentLanguage } = useLanguage();
  const t = contactTranslations[currentLanguage] || contactTranslations.tr;

  return (
    <PageContainer>
      {/* Animated Background Elements */}
      <BgDecoration size="300px" top="-150px" left="-150px" delay={20} />
      <BgDecoration size="200px" bottom="-100px" right="-100px" delay={15} />
      <BgDecoration size="150px" top="50%" right="10%" delay={10} />

      <Container>
        {/* Hero Section */}
        <Hero>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </Hero>

        {/* Cards Container */}
        <CardsContainer>
          {/* Contact Form Card */}
          <GlassCard>
            <CardTitle>{t.sendMessage}</CardTitle>
            <form>
              <FormRow>
                <FormGroup>
                  <StyledLabel htmlFor="name">{t.name}</StyledLabel>
                  <StyledInput type="text" id="name" name="name" required />
                </FormGroup>
                <FormGroup>
                  <StyledLabel htmlFor="email">{t.email}</StyledLabel>
                  <StyledInput type="email" id="email" name="email" required />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <StyledLabel htmlFor="subject">{t.subject}</StyledLabel>
                <StyledInput type="text" id="subject" name="subject" required />
              </FormGroup>
              <FormGroup>
                <StyledLabel htmlFor="message">{t.message}</StyledLabel>
                <StyledTextarea id="message" name="message" required />
              </FormGroup>
              <SubmitButton type="submit">{t.submit}</SubmitButton>
            </form>
          </GlassCard>

          {/* Contact Info Card */}
          <GlassCard>
            <CardTitle>{t.contactInfo}</CardTitle>

            <InfoItem>
              <InfoIcon>
                <LocationOnIcon />
              </InfoIcon>
              <Box>
                <h3 style={{ color: "#1e293b", fontSize: "1.1rem", margin: "0 0 5px 0", fontWeight: 600 }}>
                  {t.address}
                </h3>
                <p style={{ color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  Vatan O.S.B. Mah. 305. Cad. No:13/1
                  <br />
                  Merkez/Isparta
                </p>
              </Box>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <EmailIcon />
              </InfoIcon>
              <Box>
                <h3 style={{ color: "#1e293b", fontSize: "1.1rem", margin: "0 0 5px 0", fontWeight: 600 }}>
                  {t.email}
                </h3>
                <p style={{ color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  <a
                    href="mailto:info@kordinamik.com"
                    style={{
                      color: "#555555",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                  >
                    info@kordinamik.com
                  </a>
                  <br />
                  <a
                    href="mailto:export@kordinamik.com"
                    style={{
                      color: "#555555",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                  >
                    export@kordinamik.com
                  </a>
                </p>
              </Box>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <PhoneIcon />
              </InfoIcon>
              <Box>
                <h3 style={{ color: "#1e293b", fontSize: "1.1rem", margin: "0 0 5px 0", fontWeight: 600 }}>
                  {t.phone}
                </h3>
                <p style={{ color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  Tel:{" "}
                  <a
                    href="tel:+902462222090"
                    style={{
                      color: "#555555",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                  >
                    +90 246 222 20 90
                  </a>
                  <br />
                  Fax: +90 246 222 20 91
                </p>
              </Box>
            </InfoItem>
          </GlassCard>
        </CardsContainer>

        {/* Map Section */}
        <MapSection>
          <MapOverlay>
            <h3>{t.factoryLocation}</h3>
            <p>{t.location}</p>
          </MapOverlay>
          <iframe
            title="Kordinamik Fabrika Konumu"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.5072947039137!2d30.59794507624302!3d37.752921771973294!2m3!1f0!2f0!3f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c5b53229faf873%3A0xf9b467247374b42a!2sKORD%C4%B0NAM%C4%B0K%20ISI%20S%C4%B0STEMLER%C4%B0%20SANAY%C4%B0%20ve%20T%C4%B0CARET%20LTD.%20%C5%9ET%C4%B0.!5e0!3m2!1str!2str!4v1696175400000!5m2!1str!2str"
            style={{ width: "100%", height: "100%", border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </MapSection>
      </Container>
    </PageContainer>
  );
}

export default Iletisim;