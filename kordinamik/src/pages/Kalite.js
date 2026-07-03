


import React, { useState } from "react";
import { Box, styled, IconButton, Modal, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DownloadIcon from "@mui/icons-material/Download";
import { useLanguage } from "../components/LanguageContext";

// Import your certificate images
import cert1 from "../assets/a.jpeg";
import cert2 from "../assets/b.jpeg";
import cert3 from "../assets/c.jpeg";
import cert4 from "../assets/d.jpeg";
import cert5 from "../assets/e.jpeg";

// Styled Components
const PageContainer = styled(Box)({
  background: "linear-gradient(135deg, #2f2929ff 0%, #b91c1c 100%)",
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
  marginBottom: "60px",
  animation: "fadeInDown 0.8s ease-out",
  "@keyframes fadeInDown": {
    from: { opacity: 0, transform: "translateY(-30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "& h1": {
    fontSize: "4rem",
    fontWeight: 800,
    color: "white",
    marginBottom: "20px",
    textShadow: "0 4px 20px rgba(0,0,0,0.1)",
    letterSpacing: "-1px",
    "@media (max-width: 768px)": {
      fontSize: "2.5rem",
    },
  },
  "& p": {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1.2rem",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: 1.8,
  },
});

const CertificatesGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "30px",
  marginBottom: "60px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const CertificateCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  animation: "fadeInUp 1s ease-out",
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: "0 30px 60px rgba(220, 38, 38, 0.3)",
    "& .overlay": {
      opacity: 1,
    },
    "& img": {
      transform: "scale(1.05)",
    },
  },
});

const CertificateImage = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  transition: "transform 0.3s ease",
  display: "block",
  "@media (max-width: 480px)": {
    height: "260px",
  },
});

const CertificateOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  color: "white",
  "& .icon": {
    fontSize: "3rem",
    marginBottom: "15px",
  },
  "& .text": {
    fontSize: "1.1rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
});

const CertificateInfo = styled(Box)({
  padding: "20px",
  background: "white",
  "& h3": {
    fontSize: "1.2rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "8px",
  },
  "& p": {
    color: "#64748b",
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },
});

const ModalContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "90vw",
  maxHeight: "90vh",
  outline: "none",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
});

const ModalImage = styled("img")({
  width: "100%",
  height: "auto",
  maxHeight: "90vh",
  objectFit: "contain",
  display: "block",
});

const ModalControls = styled(Box)({
  position: "absolute",
  top: "20px",
  right: "20px",
  display: "flex",
  gap: "10px",
});

const ControlButton = styled(IconButton)({
  background: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(10px)",
  color: "white",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.7)",
  },
});

// Translations
const qualityTranslations = {
  tr: {
    title: "Kalite Belgelerimiz",
    subtitle: "Uluslararası standartlarda üretim yapıyoruz. Kalite belgelerimiz, ürünlerimizin güvenilirliğini ve yüksek standartlarını garanti eder.",
    viewCertificate: "Belgeyi Görüntüle",
    certificates: [
      {
        title: "CE Uygunluk Belgesi",
        description: "97/23/EC Direktifine göre basınçlı ekipmanlar için uygunluk belgesi",
      },
      {
        title: "TSE Hizmet Yeterlilik Belgesi",
        description: "Türk Standartları Enstitüsü tarafından verilen hizmet yeterlilik belgesi",
      },
      {
        title: "Sanayi Sicil Belgesi",
        description: "T.C. Bilim, Sanayi ve Teknoloji Bakanlığı sanayi sicil belgesi",
      },
      {
        title: "Marka Tescil Belgesi",
        description: "Türk Patent Enstitüsü tarafından tescillenmiş marka belgesi",
      },
      {
        title: "Satış Sonrası Hizmet Belgesi",
        description: "Gümrük ve Ticaret Bakanlığı satış sonrası hizmet yeterlilik belgesi",
      },
    ],
  },
  en: {
    title: "Quality Certificates",
    subtitle: "We produce according to international standards. Our quality certificates guarantee the reliability and high standards of our products.",
    viewCertificate: "View Certificate",
    certificates: [
      {
        title: "CE Conformity Certificate",
        description: "Conformity certificate for pressure equipment according to 97/23/EC Directive",
      },
      {
        title: "TSE Service Competence Certificate",
        description: "Service competence certificate issued by Turkish Standards Institution",
      },
      {
        title: "Industrial Registration Certificate",
        description: "Industrial registration certificate from Ministry of Science, Industry and Technology",
      },
      {
        title: "Trademark Registration Certificate",
        description: "Trademark certificate registered by Turkish Patent Institute",
      },
      {
        title: "After-Sales Service Certificate",
        description: "After-sales service competence certificate from Ministry of Customs and Trade",
      },
    ],
  },
  ru: {
    title: "Сертификаты качества",
    subtitle: "Мы производим продукцию в соответствии с международными стандартами. Наши сертификаты качества гарантируют надежность и высокие стандарты нашей продукции.",
    viewCertificate: "Просмотреть сертификат",
    certificates: [
      {
        title: "Сертификат соответствия CE",
        description: "Сертификат соответствия для оборудования под давлением согласно Директиве 97/23/EC",
      },
      {
        title: "Сертификат компетентности TSE",
        description: "Сертификат компетентности услуг, выданный Турецким институтом стандартов",
      },
      {
        title: "Свидетельство о промышленной регистрации",
        description: "Свидетельство о промышленной регистрации от Министерства науки, промышленности и технологий",
      },
      {
        title: "Свидетельство о регистрации товарного знака",
        description: "Товарный знак зарегистрирован Турецким патентным институтом",
      },
      {
        title: "Сертификат послепродажного обслуживания",
        description: "Сертификат компетентности послепродажного обслуживания от Министерства таможни и торговли",
      },
    ],
  },
};

function Kalite() {
  const { currentLanguage } = useLanguage();
  const t = qualityTranslations[currentLanguage] || qualityTranslations.tr;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Certificate images array
  const certificates = [
    { image: cert1, ...t.certificates[0] },
    { image: cert2, ...t.certificates[1] },
    { image: cert3, ...t.certificates[2] },
    { image: cert4, ...t.certificates[3] },
    { image: cert5, ...t.certificates[4] },
  ];

  const handleOpenModal = (certificate) => {
    setSelectedCertificate(certificate);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCertificate(null);
  };

  const handleDownload = () => {
    if (selectedCertificate) {
      const link = document.createElement("a");
      link.href = selectedCertificate.image;
      link.download = `${selectedCertificate.title}.jpg`;
      link.click();
    }
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

        {/* Certificates Grid */}
        <CertificatesGrid>
          {certificates.map((certificate, index) => (
            <CertificateCard
              key={index}
              onClick={() => handleOpenModal(certificate)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Box position="relative">
                <CertificateImage src={certificate.image} alt={certificate.title} />
                <CertificateOverlay className="overlay">
                  <ZoomInIcon className="icon" />
                  <span className="text">{t.viewCertificate}</span>
                </CertificateOverlay>
              </Box>
              <CertificateInfo>
                <h3>{certificate.title}</h3>
                <p>{certificate.description}</p>
              </CertificateInfo>
            </CertificateCard>
          ))}
        </CertificatesGrid>
      </Container>

      {/* Modal for viewing certificates */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{ backdropFilter: "blur(5px)" }}
      >
        <Fade in={modalOpen}>
          <ModalContent>
            {selectedCertificate && (
              <>
                <ModalImage 
                  src={selectedCertificate.image} 
                  alt={selectedCertificate.title} 
                />
                <ModalControls>
                  <ControlButton onClick={handleDownload}>
                    <DownloadIcon />
                  </ControlButton>
                  <ControlButton onClick={handleCloseModal}>
                    <CloseIcon />
                  </ControlButton>
                </ModalControls>
              </>
            )}
          </ModalContent>
        </Fade>
      </Modal>
    </PageContainer>
  );
}

export default Kalite;