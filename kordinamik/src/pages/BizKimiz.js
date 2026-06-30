import React from "react";
import { Box, styled } from "@mui/material";
import { useLanguage } from "../components/LanguageContext";
import kaliteImage from "../assets/kalite.jpeg";

// Styled Components
const PageContainer = styled(Box)({
  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  paddingTop: "100px",
  paddingBottom: "60px",
});

const BgDecoration = styled(Box)(({ size, top, left, right, bottom, delay }) => ({
  position: "fixed",
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

const ContentCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "30px",
  padding: "60px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  animation: "fadeInUp 1s ease-out",
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (max-width: 768px)": {
    padding: "30px",
  },
});

const ImageContainer = styled(Box)({
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto 50px",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
  position: "relative",
  background: "linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)",
  padding: "3px",
  "& img": {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: "17px",
  },
});

const CompanyName = styled(Box)({
  fontSize: "1.8rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #555555 0%, #333333 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  marginBottom: "30px",
  textAlign: "center",
  letterSpacing: "1px",
  "@media (max-width: 768px)": {
    fontSize: "1.4rem",
  },
});

const TextContent = styled(Box)({
  color: "#4a5568",
  lineHeight: "1.9",
  fontSize: "1.05rem",
  textAlign: "justify",
  "& p": {
    marginBottom: "20px",
    textIndent: "30px",
  },
  "& p:first-of-type": {
    textIndent: "0",
  },
  "@media (max-width: 768px)": {
    fontSize: "1rem",
    textAlign: "left",
  },
});

const Signature = styled(Box)({
  marginTop: "40px",
  paddingTop: "30px",
  borderTop: "2px solid rgba(220, 220, 220, 0.8)",
  textAlign: "center",
  "& .regards": {
    color: "#64748b",
    fontSize: "1rem",
    fontStyle: "italic",
    marginBottom: "10px",
  },
  "& .company": {
    fontSize: "1.2rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #555555 0%, #333333 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "0.5px",
  },
});

const FeatureBox = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "25px",
  marginTop: "40px",
  marginBottom: "40px",
});

const FeatureCard = styled(Box)({
  background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
  padding: "25px",
  borderRadius: "15px",
  textAlign: "center",
  transition: "all 0.3s ease",
  border: "1px solid rgba(220, 220, 220, 0.8)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  },
  "& .number": {
    fontSize: "2.5rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #555555 0%, #333333 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "10px",
  },
  "& .label": {
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
});

// Translations for the about page
const aboutTranslations = {
  tr: {
    title: "Biz Kimiz",
    subtitle: "11 yıllık tecrübemizle kaliteli ısı sistemleri üretiyoruz",
    established: "Kuruluş Yılı",
    area: "Kapalı Alan",
    products: "Ürün Çeşidi",
    experience: "Yıllık Deneyim",
    regards: "SAYGILARIMIZLA",
    paragraphs: [
      "KORDİNAMİK ISI SİSTEMLERİ SAN. VE TİC. LTD. ŞTİ 2013 yılında Isparta şehrinde kurulmuştur. Şirketimiz 6200m² (metrekare) kapalı alanda hizmet vermektedir. Şirketimiz kısa sürede yüksek nitelikli uzmanları bir araya getirip, dünya standartlarına göre kaliteli ürünlerin imalatını gerçekleştirmiştir.",
      "Katı yakıtlı kalorifer kazanları, yıllardır uzmanlarımız tarafından geliştirilen en son yüksek teknoloji yardımıyla üretilmektedir. Bu uzun yıllar boyunca edindiğimiz deneyim süreci içerisinde, katı yakıtlı kalorifer kazanlarının imalatında büyük bir atılım yapılmıştır.",
      "Şirketimiz kuruluş tarihinden bu yana 11 farklı ürün çeşidi ile yüksek teknolojili ürün üretmektedir. Şirketimiz katı yakıtlı kalorifer kazanı üzerinde tecrübeler neticesinde en ekonomik, son derece teknolojik, yüksek verimli otomatik yüklemeli ve 5 geçişli kalorifer kazanları üretmektedir.",
      "Şirketimiz Türkiye iç pazarlarında lider bir firma olup, üretim kapasitesini genişletmekte ve Dünya pazarında lider olmayı hedeflemektedir.",
      "KORDİNAMİK ISI SİSTEMLERİ SAN. VE TİC. LTD. ŞTİ çalışmalarında müşteri ihtiyaçlarına ve taleplerine göre yönelip, kazan sistemleri seçiminde değerlendirme ve danışmanlık hizmetinde sağlamaktadır. Firmamız her zaman kaliteden ödün vermeyen hizmet anlayışını ilke edinmiştir.",
      "Üretimde başarı ve sürekliliğin teminatı, hizmette dürüstlük ve kalitedir. Bu değişmez prensibiyle çalışan KORDİNAMİK ISI SİSTEMLERİ SAN. VE TİC. LTD. ŞTİ gösterdiğiniz yakın ilgi ve desteğinizden ötürü teşekkür ederek sizlere bugün ve gelecekte hizmet vermeye devam edecektir."
    ],
  },
  en: {
    title: "About Us",
    subtitle: "Producing quality heating systems with 11 years of experience",
    established: "Established",
    area: "Indoor Area",
    products: "Product Types",
    experience: "Years Experience",
    regards: "BEST REGARDS",
    paragraphs: [
      "KORDINAMIK Heating Systems was founded in 2013 in Isparta and operates in a 6200 m² indoor facility. In a short time we gathered highly qualified experts and started manufacturing to global standards.",
      "Our solid-fuel boilers are produced with the latest technology developed by our engineers. Over the years we have made a major leap in the manufacturing of solid-fuel heating boilers.",
      "Since establishment, we have produced 11 different product types with advanced technology, focusing on economical, highly efficient, automatic loading and 5-pass solid-fuel boilers.",
      "We aim to be a leader in the domestic market and expand our production capacity to lead in international markets.",
      "We align our work with customer needs, offering assessment and consultancy for boiler system selection, always prioritizing uncompromising quality.",
      "We believe success and continuity in production rest on honesty and quality in service. Thank you for your support as we continue to serve today and in the future."
    ],
  },
  ru: {
    title: "О нас",
    subtitle: "Производим качественные системы отопления с 11-летним опытом",
    established: "Год основания",
    area: "Крытая площадь",
    products: "Видов продукции",
    experience: "Лет опыта",
    regards: "С УВАЖЕНИЕМ",
    paragraphs: [
      "Компания KORDINAMIK была основана в 2013 году в Испарте и работает на закрытой площади 6200 м². За короткое время мы объединили квалифицированных специалистов и наладили производство по мировым стандартам.",
      "Наши твердотопливные котлы производятся с использованием новейших технологий, разработанных нашими инженерами. За годы работы мы добились значительного прогресса в производстве котлов.",
      "С момента основания мы выпускаем 11 типов высокотехнологичной продукции, уделяя внимание экономичным и высокоэффективным твердотопливным котлам с автоматической загрузкой и 5 ходами.",
      "Мы стремимся быть лидером на внутреннем рынке и расширять производство, чтобы стать лидером на мировом рынке.",
      "Мы ориентируемся на потребности клиентов, предоставляя оценку и консультации при выборе котельных систем, всегда придерживаясь принципа качества.",
      "Успех и стабильность в производстве основаны на честности и качестве обслуживания. Благодарим за поддержку и продолжим обслуживать вас сегодня и в будущем."
    ],
  },
};

function BizKimiz() {
  const { currentLanguage } = useLanguage();
  const t = aboutTranslations[currentLanguage] || aboutTranslations.tr;

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

        {/* Main Content Card */}
        <ContentCard>
          {/* Company Image */}
          <ImageContainer>
            <img 
              src={kaliteImage} 
              alt="Kordinamik Factory"
              style={{ background: "white" }}
            />
          </ImageContainer>

          {/* Company Name */}
          <CompanyName>
            KORDİNAMİK ISI SİSTEMLERİ SAN. VE TİC. LTD. ŞTİ
          </CompanyName>

          {/* Feature Cards */}
          <FeatureBox>
            <FeatureCard>
              <div className="number">2013</div>
              <div className="label">{t.established}</div>
            </FeatureCard>
            <FeatureCard>
              <div className="number">6200m²</div>
              <div className="label">{t.area}</div>
            </FeatureCard>
            <FeatureCard>
              <div className="number">11</div>
              <div className="label">{t.products}</div>
            </FeatureCard>
            <FeatureCard>
              <div className="number">11+</div>
              <div className="label">{t.experience}</div>
            </FeatureCard>
          </FeatureBox>

          {/* Text Content */}
          <TextContent>
            {t.paragraphs.map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </TextContent>

          {/* Signature */}
          <Signature>
            <div className="regards">{t.regards}</div>
            <div className="company">KORDİNAMİK ISI SİSTEMLERİ SAN. VE TİC. LTD. ŞTİ</div>
          </Signature>
        </ContentCard>
      </Container>
    </PageContainer>
  );
}

export default BizKimiz;