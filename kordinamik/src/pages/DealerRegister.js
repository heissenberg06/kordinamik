import React, { useState } from "react";
import { Box, styled, Alert, CircularProgress } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
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
});

const Input = styled("input")({
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
  "&::placeholder": {
    color: "#cbd5e1",
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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 15px 35px rgba(220, 38, 38, 0.4)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    opacity: 0.7,
    cursor: "not-allowed",
  },
});

// Translations
const translations = {
  tr: {
    backToSelection: "Geri Dön",
    title: "Bayi Hesabı Oluştur",
    subtitle: "Onay kodu ve başvuruda kullandığınız e-posta ile hesap oluşturun",
    approvalCode: "Onay Kodu",
    approvalCodePlaceholder: "Size verilen onay kodu",
    email: "E-posta",
    emailPlaceholder: "Başvuruda kullandığınız e-posta",
    password: "Şifre",
    passwordPlaceholder: "Güçlü bir şifre oluşturun",
    confirmPassword: "Şifre Tekrar",
    confirmPasswordPlaceholder: "Şifrenizi tekrar girin",
    registerButton: "Hesap Oluştur",
    success: "Hesabınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...",
    error: "Hesap oluşturma başarısız. Lütfen bilgilerinizi kontrol edin.",
    passwordMismatch: "Şifreler eşleşmiyor",
    loginLink: "Zaten hesabınız var mı? Giriş Yap",
  },
  en: {
    backToSelection: "Go Back",
    title: "Create Dealer Account",
    subtitle: "Use the approval code and the email you used in the application",
    approvalCode: "Approval Code",
    approvalCodePlaceholder: "Approval code provided to you",
    email: "Email",
    emailPlaceholder: "Email used in your application",
    password: "Password",
    passwordPlaceholder: "Create a strong password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    registerButton: "Create Account",
    success: "Your account has been created successfully! Redirecting to login page...",
    error: "Account creation failed. Please check your information.",
    passwordMismatch: "Passwords do not match",
    loginLink: "Already have an account? Login",
  },
  ru: {
    backToSelection: "Назад",
    title: "Создать учетную запись дилера",
    subtitle: "Используйте код одобрения и почту, указанную в заявке",
    approvalCode: "Код подтверждения",
    approvalCodePlaceholder: "Предоставленный вам код подтверждения",
    email: "Эл. почта",
    emailPlaceholder: "Почта из вашей заявки",
    password: "Пароль",
    passwordPlaceholder: "Создайте надежный пароль",
    confirmPassword: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Введите пароль еще раз",
    registerButton: "Создать учетную запись",
    success: "Ваша учетная запись успешно создана! Перенаправление на страницу входа...",
    error: "Не удалось создать учетную запись. Пожалуйста, проверьте вашу информацию.",
    passwordMismatch: "Пароли не совпадают",
    loginLink: "Уже есть учетная запись? Войти",
  },
};

function DealerRegister() {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { register, error: dealerError } = useDealer();
  const t = translations[currentLanguage] || translations.tr;

  const [formData, setFormData] = useState({
    approval_code: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (!formData.email || !formData.approval_code) {
      setError(t.error);
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        approval_code: formData.approval_code,
      });
      
      if (success) {
        setSuccess(true);
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/giris/bayi");
        }, 2000);
      } else {
        setError(dealerError || t.error);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(dealerError || err.response?.data?.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Container>
        <BackButton to="/giris/bayi">
          <ArrowBackIcon />
          {t.backToSelection}
        </BackButton>

        <RegisterCard>
          <Title>{t.title}</Title>
          <Subtitle>{t.subtitle}</Subtitle>

          {success ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              {t.success}
            </Alert>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || dealerError}
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">{t.email}</Label>
              <InputWrapper>
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
              <Label htmlFor="approval_code">{t.approvalCode}</Label>
              <InputWrapper>
                <Input
                  type="text"
                  id="approval_code"
                  name="approval_code"
                  placeholder={t.approvalCodePlaceholder}
                  value={formData.approval_code}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">{t.password}</Label>
              <InputWrapper>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <InputWrapper>
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

            <SubmitButton type="submit" disabled={loading || success}>
              {loading ? <CircularProgress size={24} color="inherit" /> : t.registerButton}
            </SubmitButton>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link to="/giris/bayi" style={{ color: '#dc2626', textDecoration: 'none' }}>
              {t.loginLink}
            </Link>
          </Box>
        </RegisterCard>
      </Container>
    </PageContainer>
  );
}

export default DealerRegister;
