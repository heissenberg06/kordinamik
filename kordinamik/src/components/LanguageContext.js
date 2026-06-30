import React, { createContext, useState, useContext, useEffect } from 'react';

// All translations for the app
const translations = {
  tr: {
    // Navbar
    home: "Ana Sayfa",
    products: "Ürünlerimiz",
    about: "Biz Kimiz",
    quality: "Kalite",
    contact: "İletişim",
    getQuote: "Teklif Al",
    
    // Contact Page
    contactTitle: "Bize Ulaşın",
    contactSubtitle: "Sorularınız ve projeleriniz için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.",
    sendMessage: "Mesaj Gönderin",
    contactInfo: "İletişim Bilgileri",
    yourName: "Adınız",
    email: "E-posta",
    subject: "Konu",
    yourMessage: "Mesajınız",
    send: "Gönder",
    address: "Adres",
    phone: "Telefon",
    factoryLocation: "Fabrika Konumu",
    
    // Common
    loading: "Yükleniyor...",
    error: "Hata",
    success: "Başarılı",
  },
  en: {
    // Navbar
    home: "Home",
    products: "Products",
    about: "About Us",
    quality: "Quality",
    contact: "Contact",
    getQuote: "Get Quote",
    
    // Contact Page
    contactTitle: "Contact Us",
    contactSubtitle: "Get in touch with us for your questions and projects. We'll get back to you as soon as possible.",
    sendMessage: "Send Message",
    contactInfo: "Contact Information",
    yourName: "Your Name",
    email: "Email",
    subject: "Subject",
    yourMessage: "Your Message",
    send: "Send",
    address: "Address",
    phone: "Phone",
    factoryLocation: "Factory Location",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
  ru: {
    // Navbar
    home: "Главная",
    products: "Продукты",
    about: "О нас",
    quality: "Качество",
    contact: "Контакты",
    getQuote: "Получить предложение",
    
    // Contact Page
    contactTitle: "Свяжитесь с нами",
    contactSubtitle: "Свяжитесь с нами по вашим вопросам и проектам. Мы свяжемся с вами как можно скорее.",
    sendMessage: "Отправить сообщение",
    contactInfo: "Контактная информация",
    yourName: "Ваше имя",
    email: "Электронная почта",
    subject: "Тема",
    yourMessage: "Ваше сообщение",
    send: "Отправить",
    address: "Адрес",
    phone: "Телефон",
    factoryLocation: "Расположение завода",
    
    // Common
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успешно",
  },
};

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get saved language from localStorage or default to Turkish
    return localStorage.getItem('language') || 'tr';
  });

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Helper function to get translation
  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  // Get all translations for current language
  const currentTranslations = translations[currentLanguage];

  const value = {
    currentLanguage,
    setCurrentLanguage,
    t,
    translations: currentTranslations,
    availableLanguages: [
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    ],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;