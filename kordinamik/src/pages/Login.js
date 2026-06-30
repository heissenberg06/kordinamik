import React, { useState } from "react";
import { Box, styled, Alert } from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLanguage } from "../components/LanguageContext";
import { useDealer } from "../components/DealerContext";

// Styled Components
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
  maxWidth: "500px",
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

const LoginCard = styled(Box)({
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

const ForgotPassword = styled(Link)({
  display: "block",
  textAlign: "right",
  color: "#dc2626",
  fontSize: "0.9rem",
  textDecoration: "none",
  marginTop: "-15px",
  marginBottom: "25px",
  transition: "all 0.3s ease",
  "&:hover": {
    textDecoration: "underline",
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

const RegisterPrompt = styled(Box)({
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
    dealerLogin: "Bayi Girişi",
    standardLogin: "Standart Kullanıcı Girişi",
    welcomeBack: "Tekrar Hoş Geldiniz!",
    loginSubtitle: "Hesabınıza giriş yapmak için bilgilerinizi girin",
    email: "E-posta Adresi",
    emailPlaceholder: "ornek@email.com",
    password: "Şifre",
    passwordPlaceholder: "Şifrenizi girin",
    forgotPassword: "Şifremi Unuttum?",
    loginButton: "Giriş Yap",
    or: "veya",
    noAccount: "Hesabınız yok mu?",
    register: "Kayıt Ol",
    loginFailed: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
  },
  en: {
    backToSelection: "Go Back",
    dealerLogin: "Dealer Login",
    standardLogin: "Standard User Login",
    welcomeBack: "Welcome Back!",
    loginSubtitle: "Enter your credentials to access your account",
    email: "Email Address",
    emailPlaceholder: "example@email.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    forgotPassword: "Forgot Password?",
    loginButton: "Login",
    or: "or",
    noAccount: "Don't have an account?",
    register: "Register",
    loginFailed: "Login failed. Please check your credentials.",
  },
  ru: {
    backToSelection: "Назад",
    dealerLogin: "Вход для дилера",
    standardLogin: "Вход стандартного пользователя",
    welcomeBack: "С возвращением!",
    loginSubtitle: "Введите свои учетные данные для доступа к учетной записи",
    email: "Адрес электронной почты",
    emailPlaceholder: "primer@email.com",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    forgotPassword: "Забыли пароль?",
    loginButton: "Войти",
    or: "или",
    noAccount: "Нет учетной записи?",
    register: "Зарегистрироваться",
    loginFailed: "Ошибка входа. Пожалуйста, проверьте свои учетные данные.",
  },
};

function Login() {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { login, error: dealerError } = useDealer();
  const t = translations[currentLanguage] || translations.tr;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDealer = userType === "bayi";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isDealer) {
        // Dealer login
        const success = await login(formData);
        if (success) {
          // Navigate to products page after successful login
          navigate("/bayi-profil");
        } else {
          setError(dealerError || t.loginFailed);
        }
      } else {
        // Standard user login (not implemented yet)
        console.log("Standard user login:", formData);
        // For now, just navigate to home
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Container>

        <LoginCard>
          <UserTypeIndicator>
            {isDealer ? <StorefrontIcon /> : <PersonIcon />}
            <span className="type-text">
              {isDealer ? t.dealerLogin : t.standardLogin}
            </span>
          </UserTypeIndicator>

          <Title>{t.welcomeBack}</Title>
          <Subtitle>{t.loginSubtitle}</Subtitle>

          {(error || dealerError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || dealerError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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

            <ForgotPassword to="/sifremi-unuttum">
              {t.forgotPassword}
            </ForgotPassword>

            <SubmitButton 
              type="submit" 
              disabled={loading}
            >
              {loading ? "..." : t.loginButton}
            </SubmitButton>
          </form>

          <Divider>
            <div className="line"></div>
            <div className="text">{t.or}</div>
            <div className="line"></div>
          </Divider>

          <RegisterPrompt>
            {t.noAccount}{" "}
            <Link to={isDealer ? "/bayi-kayit" : `/kayit/${userType}`}>{t.register}</Link>
          </RegisterPrompt>
        </LoginCard>
      </Container>
    </PageContainer>
  );
}

export default Login;

