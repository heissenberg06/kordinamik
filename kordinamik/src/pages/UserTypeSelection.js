import React, { useState } from "react";
import {
  Box,
  styled,
  Modal,
  TextField,
  Button,
  Alert,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useLanguage } from "../components/LanguageContext";
import { API_BASE_URL } from "../config";

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
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px",
  width: "100%",
  animation: "fadeInUp 0.9s ease-out",
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
});

const Title = styled("h1")({
  fontSize: "3rem",
  fontWeight: 800,
  textAlign: "center",
  marginBottom: "20px",
  color: "#333333",
  letterSpacing: "-1px",
  "@media (max-width: 768px)": {
    fontSize: "2rem",
  },
});

const Subtitle = styled("p")({
  fontSize: "1.2rem",
  textAlign: "center",
  color: "#666666",
  marginBottom: "60px",
  "@media (max-width: 768px)": {
    fontSize: "1rem",
  },
});

const CardsContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "40px",
  maxWidth: "900px",
  margin: "0 auto",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
    gap: "30px",
  },
});

const UserTypeCard = styled(Box)({
  background: "white",
  borderRadius: "30px",
  padding: "50px 30px",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "3px solid transparent",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    opacity: 0,
    transition: "opacity 0.4s ease",
    zIndex: 0,
  },

  "&:hover": {
    transform: "translateY(-10px)",
    borderColor: "#dc2626",
    boxShadow: "0 20px 60px rgba(220, 38, 38, 0.2)",
    "&::before": {
      opacity: 0.05,
    },
    "& .icon": {
      transform: "scale(1.1) rotate(5deg)",
      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
      color: "white",
    },
    "& .title": {
      color: "#dc2626",
    },
  },

  "& > *": {
    position: "relative",
    zIndex: 1,
  },
});

const IconContainer = styled(Box)({
  width: "120px",
  height: "120px",
  margin: "0 auto 30px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.4s ease",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  "& svg": {
    fontSize: "60px",
    color: "#666666",
    transition: "color 0.4s ease",
  },
});

const CardTitle = styled("h2")({
  fontSize: "2rem",
  fontWeight: 700,
  color: "#333333",
  marginBottom: "15px",
  transition: "color 0.4s ease",
  "@media (max-width: 768px)": {
    fontSize: "1.5rem",
  },
});

const CardDescription = styled("p")({
  fontSize: "1.1rem",
  color: "#666666",
  lineHeight: "1.6",
  marginBottom: "20px",
});

const CardButton = styled(Box)({
  display: "inline-block",
  padding: "12px 30px",
  background: "linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 100%)",
  color: "#333333",
  borderRadius: "50px",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "all 0.3s ease",
  marginTop: "10px",
});

// Modal Styled Components
const ModalContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "900px",
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: "white",
  borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  padding: "40px",
  "@media (max-width: 768px)": {
    padding: "20px",
    width: "95%",
  },
});

const ModalHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
});

const ModalTitle = styled("h2")({
  fontSize: "2rem",
  fontWeight: 700,
  color: "#333333",
  "@media (max-width: 768px)": {
    fontSize: "1.5rem",
  },
});

const SectionTitle = styled("h3")({
  fontSize: "1.2rem",
  fontWeight: 600,
  color: "#333333",
  marginTop: "25px",
  marginBottom: "15px",
  paddingBottom: "8px",
  borderBottom: "2px solid #f0f0f0",
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "&:hover fieldset": {
      borderColor: "#dc2626",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#dc2626",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#dc2626",
  },
});

const SubmitButton = styled(Button)({
  marginTop: "20px",
  padding: "12px 30px",
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "50px",
  background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
  color: "white",
  boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 15px 40px rgba(220, 38, 38, 0.4)",
  },
  "&:disabled": {
    background: "#cccccc",
    boxShadow: "none",
  },
});

// Translations
const translations = {
  tr: {
    title: "Bayi Portalı",
    subtitle: "Mevcut bayilerimiz giriş yapabilir veya yeni bayi başvurusunda bulunabilirsiniz",
    dealerLogin: {
      title: "Bayi Girişi",
      description: "Mevcut bayilerimiz için özel fiyatlandırma ve toplu sipariş sistemi",
      button: "Giriş Yap",
    },
    dealerApplication: {
      title: "Bayi Başvurusu",
      description: "Bayimiz olmak için başvuru formunu doldurun. Başvurunuz yönetici onayına gönderilecektir",
      button: "Başvuru Yap",
    },
    form: {
      title: "Bayi Başvuru Formu",
      sections: {
        company: "Firma Bilgileri",
        contact: "İletişim Bilgileri",
        commercial: "Ticari Bilgiler",
        additional: "Ek Bilgiler",
      },
      fields: {
        companyName: "Firma Adı",
        companyTitle: "Firma Unvanı",
        taxOffice: "Vergi Dairesi",
        taxNumber: "Vergi Numarası",
        tradeRegister: "Ticaret Sicil No",
        website: "Web Sitesi (Opsiyonel)",
        contactName: "Yetkili Adı Soyadı",
        email: "E-posta Adresi",
        phone: "Telefon Numarası",
        mobile: "Cep Telefonu",
        address: "Adres",
        city: "Şehir",
        district: "İlçe",
        postalCode: "Posta Kodu",
        country: "Ülke",
        businessType: "Faaliyet Alanı",
        employeeCount: "Çalışan Sayısı",
        annualRevenue: "Yıllık Ciro",
        brands: "Çalıştığınız Markalar",
        message: "Ek Bilgiler / Mesajınız",
        agreement: "Bayilik şartlarını kabul ediyorum",
      },
      businessTypes: [
        "Perakende Satış",
        "Toptan Satış",
        "E-ticaret",
        "İnşaat/Yapı Market",
        "Diğer",
      ],
      employeeCounts: ["1-5", "6-10", "11-25", "26-50", "50+"],
      annualRevenues: [
        "0-1 Milyon TL",
        "1-5 Milyon TL",
        "5-10 Milyon TL",
        "10-25 Milyon TL",
        "25+ Milyon TL",
      ],
      submit: "Başvuruyu Gönder",
      submitting: "Gönderiliyor...",
      success: "Başvurunuz başarıyla alındı! En kısa sürede size dönüş yapacağız.",
      error: "Bir hata oluştu. Lütfen tekrar deneyin.",
      requiredField: "Bu alan zorunludur",
      invalidEmail: "Geçerli bir e-posta adresi girin",
      agreementError: "Bayilik şartlarını kabul etmelisiniz",
    },
  },
  en: {
    title: "Dealer Portal",
    subtitle: "Existing dealers can login or apply to become a new dealer",
    dealerLogin: {
      title: "Dealer Login",
      description: "Special pricing and bulk order system for our existing dealers",
      button: "Login",
    },
    dealerApplication: {
      title: "Dealer Application",
      description: "Fill out the application form to become our dealer. Your application will be sent for admin approval",
      button: "Apply Now",
    },
    form: {
      title: "Dealer Application Form",
      sections: {
        company: "Company Information",
        contact: "Contact Information",
        commercial: "Commercial Information",
        additional: "Additional Information",
      },
      fields: {
        companyName: "Company Name",
        companyTitle: "Company Title",
        taxOffice: "Tax Office",
        taxNumber: "Tax Number",
        tradeRegister: "Trade Register No",
        website: "Website (Optional)",
        contactName: "Contact Person Name",
        email: "Email Address",
        phone: "Phone Number",
        mobile: "Mobile Phone",
        address: "Address",
        city: "City",
        district: "District",
        postalCode: "Postal Code",
        country: "Country",
        businessType: "Business Type",
        employeeCount: "Number of Employees",
        annualRevenue: "Annual Revenue",
        brands: "Brands You Work With",
        message: "Additional Information / Your Message",
        agreement: "I accept the dealership terms",
      },
      businessTypes: [
        "Retail",
        "Wholesale",
        "E-commerce",
        "Construction/Building Market",
        "Other",
      ],
      employeeCounts: ["1-5", "6-10", "11-25", "26-50", "50+"],
      annualRevenues: [
        "0-1 Million TL",
        "1-5 Million TL",
        "5-10 Million TL",
        "10-25 Million TL",
        "25+ Million TL",
      ],
      submit: "Submit Application",
      submitting: "Submitting...",
      success: "Your application has been successfully received! We will contact you soon.",
      error: "An error occurred. Please try again.",
      requiredField: "This field is required",
      invalidEmail: "Enter a valid email address",
      agreementError: "You must accept the dealership terms",
    },
  },
  ru: {
    title: "Портал дилера",
    subtitle: "Существующие дилеры могут войти или подать заявку на становление новым дилером",
    dealerLogin: {
      title: "Вход для дилера",
      description: "Специальные цены и система оптовых заказов для наших существующих дилеров",
      button: "Войти",
    },
    dealerApplication: {
      title: "Заявка дилера",
      description: "Заполните форму заявки, чтобы стать нашим дилером. Ваша заявка будет отправлена на одобрение администратора",
      button: "Подать заявку",
    },
    form: {
      title: "Форма заявки дилера",
      sections: {
        company: "Информация о компании",
        contact: "Контактная информация",
        commercial: "Коммерческая информация",
        additional: "Дополнительная информация",
      },
      fields: {
        companyName: "Название компании",
        companyTitle: "Юридическое название",
        taxOffice: "Налоговая служба",
        taxNumber: "ИНН",
        tradeRegister: "Регистрационный номер",
        website: "Веб-сайт (необязательно)",
        contactName: "Имя контактного лица",
        email: "Электронная почта",
        phone: "Номер телефона",
        mobile: "Мобильный телефон",
        address: "Адрес",
        city: "Город",
        district: "Район",
        postalCode: "Почтовый индекс",
        country: "Страна",
        businessType: "Тип бизнеса",
        employeeCount: "Количество сотрудников",
        annualRevenue: "Годовой доход",
        brands: "Бренды, с которыми вы работаете",
        message: "Дополнительная информация / Ваше сообщение",
        agreement: "Я принимаю условия дилерства",
      },
      businessTypes: [
        "Розничная торговля",
        "Оптовая торговля",
        "Электронная коммерция",
        "Строительство/Строительный рынок",
        "Другое",
      ],
      employeeCounts: ["1-5", "6-10", "11-25", "26-50", "50+"],
      annualRevenues: [
        "0-1 млн TL",
        "1-5 млн TL",
        "5-10 млн TL",
        "10-25 млн TL",
        "25+ млн TL",
      ],
      submit: "Отправить заявку",
      submitting: "Отправка...",
      success: "Ваша заявка успешно получена! Мы свяжемся с вами в ближайшее время.",
      error: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
      requiredField: "Это поле обязательно",
      invalidEmail: "Введите правильный адрес электронной почты",
      agreementError: "Вы должны принять условия дилерства",
    },
  },
};

function UserTypeSelection() {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.tr;

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyTitle: "",
    taxOffice: "",
    taxNumber: "",
    tradeRegister: "",
    website: "",
    contactName: "",
    email: "",
    phone: "",
    mobile: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Türkiye",
    businessType: "",
    employeeCount: "",
    annualRevenue: "",
    brands: "",
    message: "",
    agreement: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDealerLogin = () => {
    navigate("/giris/bayi");
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrors({});
    if (successMessage) {
      // Form başarılı ise formu temizle
      setFormData({
        companyName: "",
        companyTitle: "",
        taxOffice: "",
        taxNumber: "",
        tradeRegister: "",
        website: "",
        contactName: "",
        email: "",
        phone: "",
        mobile: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
        country: "Türkiye",
        businessType: "",
        employeeCount: "",
        annualRevenue: "",
        brands: "",
        message: "",
        agreement: false,
      });
      setSuccessMessage("");
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      "companyName",
      "companyTitle",
      "taxOffice",
      "taxNumber",
      "contactName",
      "email",
      "phone",
      "address",
      "city",
      "businessType",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = t.form.requiredField;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = t.form.invalidEmail;
    }

    // Agreement validation
    if (!formData.agreement) {
      newErrors.agreement = t.form.agreementError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Prepare application data
      const applicationData = {
        company_name: formData.companyName,
        company_title: formData.companyTitle,
        tax_office: formData.taxOffice,
        tax_id: formData.taxNumber,
        trade_register: formData.tradeRegister,
        website: formData.website,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        mobile: formData.mobile,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        postal_code: formData.postalCode,
        country: formData.country,
        business_type: formData.businessType,
        employee_count: formData.employeeCount,
        annual_revenue: formData.annualRevenue,
        brands: formData.brands,
        message: formData.message
      };

      // Send data to backend API
      const response = await fetch(`${API_BASE_URL}/public/dealer-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Application submitted successfully:', data);
        
        // Successful application
        setSuccessMessage(t.form.success);
        
        // Close modal after 3 seconds
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error('Application submission failed:', errorData);
        setErrorMessage(errorData.message || t.form.error);
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setErrorMessage(t.form.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Container>
        <Title>{t.title}</Title>
        <Subtitle>{t.subtitle}</Subtitle>

        <CardsContainer>
          {/* Dealer Login Card */}
          <UserTypeCard onClick={handleDealerLogin}>
            <IconContainer className="icon">
              <StorefrontIcon />
            </IconContainer>
            <CardTitle className="title">{t.dealerLogin.title}</CardTitle>
            <CardDescription>{t.dealerLogin.description}</CardDescription>
            <CardButton>{t.dealerLogin.button}</CardButton>
          </UserTypeCard>

          {/* Dealer Application Card */}
          <UserTypeCard onClick={handleOpenModal}>
            <IconContainer className="icon">
              <AssignmentIcon />
            </IconContainer>
            <CardTitle className="title">{t.dealerApplication.title}</CardTitle>
            <CardDescription>{t.dealerApplication.description}</CardDescription>
            <CardButton>{t.dealerApplication.button}</CardButton>
          </UserTypeCard>
        </CardsContainer>
      </Container>

      {/* Application Form Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
        }}
      >
        <Fade in={openModal}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t.form.title}</ModalTitle>
              <IconButton onClick={handleCloseModal} sx={{ color: "#666" }}>
                <CloseIcon />
              </IconButton>
            </ModalHeader>

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* Firma Bilgileri */}
              <SectionTitle>{t.form.sections.company}</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="companyName"
                    label={t.form.fields.companyName}
                    value={formData.companyName}
                    onChange={handleChange}
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="companyTitle"
                    label={t.form.fields.companyTitle}
                    value={formData.companyTitle}
                    onChange={handleChange}
                    error={!!errors.companyTitle}
                    helperText={errors.companyTitle}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="taxOffice"
                    label={t.form.fields.taxOffice}
                    value={formData.taxOffice}
                    onChange={handleChange}
                    error={!!errors.taxOffice}
                    helperText={errors.taxOffice}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="taxNumber"
                    label={t.form.fields.taxNumber}
                    value={formData.taxNumber}
                    onChange={handleChange}
                    error={!!errors.taxNumber}
                    helperText={errors.taxNumber}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="tradeRegister"
                    label={t.form.fields.tradeRegister}
                    value={formData.tradeRegister}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* İletişim Bilgileri */}
              <SectionTitle>{t.form.sections.contact}</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="contactName"
                    label={t.form.fields.contactName}
                    value={formData.contactName}
                    onChange={handleChange}
                    error={!!errors.contactName}
                    helperText={errors.contactName}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="email"
                    label={t.form.fields.email}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="phone"
                    label={t.form.fields.phone}
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="mobile"
                    label={t.form.fields.mobile}
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="address"
                    label={t.form.fields.address}
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="city"
                    label={t.form.fields.city}
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="district"
                    label={t.form.fields.district}
                    value={formData.district}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="postalCode"
                    label={t.form.fields.postalCode}
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="country"
                    label={t.form.fields.country}
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* Ticari Bilgiler */}
              <SectionTitle>{t.form.sections.commercial}</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    select
                    name="businessType"
                    label={t.form.fields.businessType}
                    value={formData.businessType}
                    onChange={handleChange}
                    error={!!errors.businessType}
                    helperText={errors.businessType}
                    required
                  >
                    {t.form.businessTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    select
                    name="employeeCount"
                    label={t.form.fields.employeeCount}
                    value={formData.employeeCount}
                    onChange={handleChange}
                  >
                    {t.form.employeeCounts.map((count) => (
                      <MenuItem key={count} value={count}>
                        {count}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    select
                    name="annualRevenue"
                    label={t.form.fields.annualRevenue}
                    value={formData.annualRevenue}
                    onChange={handleChange}
                  >
                    {t.form.annualRevenues.map((revenue) => (
                      <MenuItem key={revenue} value={revenue}>
                        {revenue}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="brands"
                    label={t.form.fields.brands}
                    multiline
                    rows={2}
                    value={formData.brands}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="website"
                    label={t.form.fields.website}
                    value={formData.website}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {/* Ek Bilgiler */}
              <SectionTitle>{t.form.sections.additional}</SectionTitle>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    size="small"
                    name="message"
                    label={t.form.fields.message}
                    multiline
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreement"
                        checked={formData.agreement}
                        onChange={handleChange}
                        sx={{
                          color: errors.agreement ? "error.main" : "default",
                          "&.Mui-checked": {
                            color: "#dc2626",
                          },
                        }}
                      />
                    }
                    label={t.form.fields.agreement}
                  />
                  {errors.agreement && (
                    <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5, ml: 4 }}>
                      {errors.agreement}
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                >
                  {loading ? t.form.submitting : t.form.submit}
                </SubmitButton>
              </Box>
            </form>
          </ModalContent>
        </Fade>
      </Modal>
    </PageContainer>
  );
}

export default UserTypeSelection;