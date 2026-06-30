import React, { useState } from "react";
import { Box, styled } from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLanguage } from "../components/LanguageContext";

// Styled Components (reuse most from Login.js)
const PageContainer = styled(Box)({
  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
  minHeight: "100vh",
  paddingTop: "100px",
  paddingBottom: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Container = styled(Box)({
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 20px",
  width: "100%",
});

const BackButton = styled(Link)({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  color: "#666666",
  textDecoration: "none",
  fontSize: "0.95rem",
  marginBottom: "30px",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#dc2626",
    transform: "translateX(-5px)",
  },
});

const RegisterCard = styled(Box)({
  background: "white",
  borderRadius: "30px",
  padding: "50px 40px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  border: "1px solid rgba(220, 38, 38, 0.1)",
  animation: "fadeInUp 0.9s ease-out",
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (max-width: 768px)": {
    padding: "40px 30px",
  },
});

const UserTypeIndicator = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  marginBottom: "30px",
  padding: "20px",
  background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
  borderRadius: "20px",
  color: "white",
  "& svg": {
    fontSize: "32px",
  },
  "& .type-text": {
    fontSize: "1.3rem",
    fontWeight: 700,
  },
});

const Title = styled("h1")({
  fontSize: "2.5rem",
  fontWeight: 800,
  textAlign: "center",
  marginBottom: "10px",
  color: "#333333",
  letterSpacing: "-1px",
  "@media (max-width: 768px)": {
    fontSize: "2rem",
  },
});

const Subtitle = styled("p")({
  fontSize: "1rem",
  textAlign: "center",
  color: "#666666",
  marginBottom: "40px",
});

const FormRow = styled(Box)({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const FormGroup = styled(Box)({
  marginBottom: "25px",
});

const Label = styled("label")({
  display: "block",
  color: "#555555",
  fontSize: "0.9rem",
  fontWeight: 600,
  marginBottom: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

const InputWrapper = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
  "& svg": {
    position: "absolute",
    left: "18px",
    color: "#999999",
    fontSize: "22px",
  },
});

const Input = styled("input")({
  width: "100%",
  padding: "15px 20px 15px 50px",
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
  "&::placeholder": {
    color: "#cbd5e1",
  },
});

const CheckboxWrapper = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "25px",
  "& input[type='checkbox']": {
    marginTop: "4px",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    accentColor: "#dc2626",
  },
  "& label": {
    fontSize: "0.9rem",
    color: "#666666",
    lineHeight: "1.5",
    cursor: "pointer",
    textTransform: "none",
    "& a": {
      color: "#dc2626",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
});

const SubmitButton = styled("button")({
  width: "100%",
  background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
  color: "white",
  border: "none",
  padding: "18px",
  fontSize: "1.1rem",
  fontWeight: 600,
  borderRadius: "15px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 10px 25px rgba(220, 38, 38, 0.3)",
  textTransform: "uppercase",
  letterSpacing: "1px",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 15px 35px rgba(220, 38, 38, 0.4)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const Divider = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "15px",
  margin: "30px 0",
  "& .line": {
    flex: 1,
    height: "1px",
    background: "#e2e8f0",
  },
  "& .text": {
    color: "#999999",
    fontSize: "0.9rem",
  },
});

const LoginPrompt = styled(Box)({
  textAlign: "center",
  marginTop: "25px",
  color: "#666666",
  fontSize: "0.95rem",
  "& a": {
    color: "#dc2626",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

// Translations
const translations = {
  tr: {
    backToSelection: "Geri Dön",
    dealerRegister: "Bayi Kaydı",
    standardRegister: "Standart Kullanıcı Kaydı",
    createAccount: "Hesap Oluştur",
    registerSubtitle: "Yeni hesap oluşturmak için bilgilerinizi girin",
    firstName: "Ad",
    firstNamePlaceholder: "Adınız",
    lastName: "Soyad",
    lastNamePlaceholder: "Soyadınız",
    companyName: "Firma Adı",
    companyNamePlaceholder: "Firma adınız",
    taxNumber: "Vergi Numarası",
    taxNumberPlaceholder: "Vergi numaranız",
    email: "E-posta Adresi",
    emailPlaceholder: "ornek@email.com",
    phone: "Telefon",
    phonePlaceholder: "+90 5XX XXX XX XX",
    password: "Şifre",
    passwordPlaceholder: "Şifre oluşturun",
    confirmPassword: "Şifre Tekrar",
    confirmPasswordPlaceholder: "Şifrenizi tekrar girin",
    agreeTerms: "Okudum ve kabul ediyorum",
    termsLink: "Kullanım Koşulları",
    and: "ve",
    privacyLink: "Gizlilik Politikası",
    registerButton: "Kayıt Ol",
    or: "veya",
    haveAccount: "Zaten hesabınız var mı?",
    login: "Giriş Yap",
  },
  en: {
    backToSelection: "Go Back",
    dealerRegister: "Dealer Registration",
    standardRegister: "Standard User Registration",
    createAccount: "Create Account",
    registerSubtitle: "Enter your information to create a new account",
    firstName: "First Name",
    firstNamePlaceholder: "Your first name",
    lastName: "Last Name",
    lastNamePlaceholder: "Your last name",
    companyName: "Company Name",
    companyNamePlaceholder: "Your company name",
    taxNumber: "Tax Number",
    taxNumberPlaceholder: "Your tax number",
    email: "Email Address",
    emailPlaceholder: "example@email.com",
    phone: "Phone",
    phonePlaceholder: "+90 5XX XXX XX XX",
    password: "Password",
    passwordPlaceholder: "Create password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    agreeTerms: "I have read and agree to the",
    termsLink: "Terms of Service",
    and: "and",
    privacyLink: "Privacy Policy",
    registerButton: "Register",
    or: "or",
    haveAccount: "Already have an account?",
    login: "Login",
  },
  ru: {
    backToSelection: "Назад",
    dealerRegister: "Регистрация дилера",
    standardRegister: "Регистрация стандартного пользователя",
    createAccount: "Создать учетную запись",
    registerSubtitle: "Введите свою информацию для создания новой учетной записи",
    firstName: "Имя",
    firstNamePlaceholder: "Ваше имя",
    lastName: "Фамилия",
    lastNamePlaceholder: "Ваша фамилия",
    companyName: "Название компании",
    companyNamePlaceholder: "Название вашей компании",
    taxNumber: "Налоговый номер",
    taxNumberPlaceholder: "Ваш налоговый номер",
    email: "Адрес электронной почты",
    emailPlaceholder: "primer@email.com",
    phone: "Телефон",
    phonePlaceholder: "+90 5XX XXX XX XX",
    password: "Пароль",
    passwordPlaceholder: "Создать пароль",
    confirmPassword: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Введите пароль еще раз",
    agreeTerms: "Я прочитал и согласен с",
    termsLink: "Условиями обслуживания",
    and: "и",
    privacyLink: "Политикой конфиденциальности",
    registerButton: "Зарегистрироваться",
    or: "или",
    haveAccount: "Уже есть учетная запись?",
    login: "Войти",
  },
};

function Register() {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.tr;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    taxNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const isDealer = userType === "bayi";

  // If user is a dealer, direct them to the approval-code based flow
  if (isDealer) {
    return (
      <PageContainer>
        <Container>
          <BackButton to="/giris">
            <ArrowBackIcon />
            {t.backToSelection}
          </BackButton>

          <RegisterCard>
            <UserTypeIndicator>
              <StorefrontIcon />
              <span className="type-text">{t.dealerRegister}</span>
            </UserTypeIndicator>

            <Title>{t.createAccount}</Title>
            <Subtitle>
              Onaylanan bayi başvurunuz için hesap açmak üzere{" "}
              <strong>Bayi Hesabı Oluştur</strong> ekranına ilerleyin.
            </Subtitle>

            <SubmitButton
              type="button"
              onClick={() => navigate("/bayi-kayit")}
              style={{ marginTop: "10px" }}
            >
              Onay Kodu ile Hesap Oluştur
            </SubmitButton>

            <Divider>
              <div className="line"></div>
              <div className="text">{t.or}</div>
              <div className="line"></div>
            </Divider>

            <LoginPrompt>
              {t.haveAccount}{" "}
              <Link to="/giris/bayi">{t.login}</Link>
            </LoginPrompt>
          </RegisterCard>
        </Container>
      </PageContainer>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions!");
      return;
    }

    // Handle registration logic here
    console.log("Register attempt:", { ...formData, userType });
    // Navigate to login or dashboard after successful registration
    navigate(`/giris/${userType}`);
  };

  return (
    <PageContainer>
      <Container>
        <BackButton to="/giris">
          <ArrowBackIcon />
          {t.backToSelection}
        </BackButton>

        <RegisterCard>
          <UserTypeIndicator>
            {isDealer ? <StorefrontIcon /> : <PersonIcon />}
            <span className="type-text">
              {isDealer ? t.dealerRegister : t.standardRegister}
            </span>
          </UserTypeIndicator>

          <Title>{t.createAccount}</Title>
          <Subtitle>{t.registerSubtitle}</Subtitle>

          <form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">{t.firstName}</Label>
                <InputWrapper>
                  <PersonIcon />
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder={t.firstNamePlaceholder}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="lastName">{t.lastName}</Label>
                <InputWrapper>
                  <PersonIcon />
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder={t.lastNamePlaceholder}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>
            </FormRow>

            {isDealer && (
              <FormRow>
                <FormGroup>
                  <Label htmlFor="companyName">{t.companyName}</Label>
                  <InputWrapper>
                    <BusinessIcon />
                    <Input
                      type="text"
                      id="companyName"
                      name="companyName"
                      placeholder={t.companyNamePlaceholder}
                      value={formData.companyName}
                      onChange={handleChange}
                      required={isDealer}
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="taxNumber">{t.taxNumber}</Label>
                  <InputWrapper>
                    <BusinessIcon />
                    <Input
                      type="text"
                      id="taxNumber"
                      name="taxNumber"
                      placeholder={t.taxNumberPlaceholder}
                      value={formData.taxNumber}
                      onChange={handleChange}
                      required={isDealer}
                    />
                  </InputWrapper>
                </FormGroup>
              </FormRow>
            )}

            <FormGroup>
              <Label htmlFor="email">{t.email}</Label>
              <InputWrapper>
                <EmailIcon />
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">{t.phone}</Label>
              <InputWrapper>
                <PhoneIcon />
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="password">{t.password}</Label>
                <InputWrapper>
                  <LockIcon />
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder={t.passwordPlaceholder}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <InputWrapper>
                  <LockIcon />
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder={t.confirmPasswordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>
            </FormRow>

            <CheckboxWrapper>
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms">
                {t.agreeTerms} <a href="/terms">{t.termsLink}</a> {t.and}{" "}
                <a href="/privacy">{t.privacyLink}</a>
              </label>
            </CheckboxWrapper>

            <SubmitButton type="submit" disabled={!formData.agreeTerms}>
              {t.registerButton}
            </SubmitButton>
          </form>

          <Divider>
            <div className="line"></div>
            <div className="text">{t.or}</div>
            <div className="line"></div>
          </Divider>

          <LoginPrompt>
            {t.haveAccount}{" "}
            <Link to={`/giris/${userType}`}>{t.login}</Link>
          </LoginPrompt>
        </RegisterCard>
      </Container>
    </PageContainer>
  );
}

export default Register;

