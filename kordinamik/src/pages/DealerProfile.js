import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Button, styled, Divider, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDealer } from "../components/DealerContext";
import { useLanguage } from "../components/LanguageContext";
import axios from "axios";
import { API_BASE_URL } from "../config";

const translations = {
  tr: {
    pageTitle: "Bayi Profilim",
    pageSubtitle: "Hesap bilgilerin ve son giriş detayların burada.",
    logout: "Çıkış Yap",
    contact: "Yetkili",
    email: "E-posta",
    phone: "Telefon",
    taxId: "Vergi No",
    address: "Adres",
    businessType: "Faaliyet Alanı",
    approvalCode: "Onay Kodu",
    lastLogin: "Son Giriş",
    recentOrders: "Son Siparişlerim",
    recentOrdersSubtitle: "Verdiğiniz siparişlerin durumu burada listelenir.",
    noOrders: "Henüz sipariş bulunmuyor.",
    order: "Sipariş",
    product: "ürün",
    approved: "Onaylandı",
    rejected: "Reddedildi",
    pending: "Beklemede",
    showAll: "Tümünü Gör",
    showLess: "Daha Az Göster",
    sessionNotFound: "Oturum bulunamadı. Lütfen giriş yapın.",
  },
  en: {
    pageTitle: "Dealer Profile",
    pageSubtitle: "Your account details and last login info.",
    logout: "Log Out",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    taxId: "Tax ID",
    address: "Address",
    businessType: "Business Type",
    approvalCode: "Approval Code",
    lastLogin: "Last Login",
    recentOrders: "My Recent Orders",
    recentOrdersSubtitle: "Status of your placed orders is listed here.",
    noOrders: "No orders yet.",
    order: "Order",
    product: "item(s)",
    approved: "Approved",
    rejected: "Rejected",
    pending: "Pending",
    showAll: "Show All",
    showLess: "Show Less",
    sessionNotFound: "Session not found. Please log in.",
  },
  ru: {
    pageTitle: "Профиль дилера",
    pageSubtitle: "Данные вашего аккаунта и последнего входа.",
    logout: "Выйти",
    contact: "Контакт",
    email: "Эл. почта",
    phone: "Телефон",
    taxId: "ИНН",
    address: "Адрес",
    businessType: "Тип бизнеса",
    approvalCode: "Код подтверждения",
    lastLogin: "Последний вход",
    recentOrders: "Мои последние заказы",
    recentOrdersSubtitle: "Статус ваших заказов отображается здесь.",
    noOrders: "Заказов пока нет.",
    order: "Заказ",
    product: "товар(ов)",
    approved: "Одобрено",
    rejected: "Отклонено",
    pending: "Ожидание",
    showAll: "Показать все",
    showLess: "Показать меньше",
    sessionNotFound: "Сессия не найдена. Пожалуйста, войдите.",
  },
};

const PageContainer = styled(Box)({
  minHeight: "90vh",
  paddingTop: "90px",
  paddingBottom: "60px",
  background:
    "radial-gradient(circle at 15% 20%, rgba(220,38,38,0.12), transparent 30%), radial-gradient(circle at 80% 0%, rgba(220,38,38,0.08), transparent 25%), linear-gradient(135deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(220,38,38,0.05), rgba(255,255,255,0))",
    pointerEvents: "none",
  },
});

const Container = styled(Box)({
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "0 24px",
  position: "relative",
  zIndex: 1,
  animation: "fadeInUp 0.8s ease-out",
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(24px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
});

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "16px",
  color: "#1f2937",
});

const GlowCard = styled(Card)({
  borderRadius: 24,
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 70%)",
  border: "1px solid rgba(220,38,38,0.08)",
  boxShadow: "0 20px 45px rgba(220, 38, 38, 0.08)",
});

const StatGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
  marginBottom: "14px",
});

const StatCard = styled(Box)({
  padding: "14px 16px",
  borderRadius: 16,
  background: "linear-gradient(120deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))",
  border: "1px solid rgba(220,38,38,0.1)",
  color: "#1f2937",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  boxShadow: "0 10px 25px rgba(220, 38, 38, 0.06)",
});

const DealerProfile = () => {
  const { dealer, fetchDealerProfile, logout, loading, getAuthHeader } = useDealer();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.tr;
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    const ensureProfile = async () => {
      if (!dealer) {
        setRefreshing(true);
        await fetchDealerProfile();
        setRefreshing(false);
      }
    };
    ensureProfile();
  }, [dealer, fetchDealerProfile]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!dealer) return;
      try {
        setOrdersLoading(true);
        const response = await axios.get(`${API_BASE_URL}/dealer/orders`, {
          headers: { ...getAuthHeader() },
        });
        if (response.data.status === "success") {
          setOrders(response.data.data || []);
        }
      } catch (err) {
        console.error("Siparişler alınamadı", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [dealer, getAuthHeader]);

  if (loading || refreshing) {
    return (
      <PageContainer>
        <Container sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Container>
      </PageContainer>
    );
  }

  if (!dealer) {
    return (
      <PageContainer>
        <Container>
          <Typography variant="h5" sx={{ textAlign: "center", mt: 4 }}>
            {t.sessionNotFound}
          </Typography>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Header>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
              {t.pageTitle}
            </Typography>
            <Typography sx={{ color: "#475569", mt: 0.5 }}>
              {t.pageSubtitle}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              borderRadius: 999,
              borderColor: "rgba(220,38,38,0.35)",
              color: "#dc2626",
              px: 2.8,
              "&:hover": { borderColor: "rgba(220,38,38,0.6)", backgroundColor: "rgba(220,38,38,0.06)" },
            }}
          >
            {t.logout}
          </Button>
        </Header>

        <GlowCard>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <CheckCircleIcon sx={{ color: "#34d399" }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {dealer.company_name}
              </Typography>
            </Box>

            <StatGrid>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.contact}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.contact_name}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.email}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.email}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.phone}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.phone}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.taxId}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.tax_id}</Typography>
              </StatCard>
            </StatGrid>

            <StatGrid>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.address}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.address || "-"}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.businessType}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.business_type || "-"}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.approvalCode}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.approval_code || "-"}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  {t.lastLogin}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {dealer.last_login ? new Date(dealer.last_login).toLocaleString("tr-TR") : "-"}
                </Typography>
              </StatCard>
            </StatGrid>
          </CardContent>
        </GlowCard>

        <GlowCard sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              {t.recentOrders}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              {t.recentOrdersSubtitle}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {ordersLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={26} />
              </Box>
            ) : orders.length === 0 ? (
              <Typography sx={{ color: "#94a3b8" }}>
                {t.noOrders}
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {(showAllOrders ? orders : orders.slice(0, 5)).map((order) => (
                  <Box
                    key={order.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      backgroundColor: "#f8fafc",
                      borderRadius: 2,
                      p: 2,
                      border: "1px solid rgba(148,163,184,0.2)",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {t.order} #{order.id}
                      </Typography>
                      <Typography sx={{ color: "#475569" }}>
                        {new Date(order.created_at).toLocaleString("tr-TR")}
                      </Typography>
                      <Typography sx={{ color: "#0f172a", fontWeight: 600 }}>
                        {(Number(order.total_amount) || 0).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} ₺
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                        {order.OrderItems?.length || 0} {t.product}
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        order.status === "approved"
                          ? t.approved
                          : order.status === "rejected"
                          ? t.rejected
                          : t.pending
                      }
                      color={
                        order.status === "approved"
                          ? "success"
                          : order.status === "rejected"
                          ? "error"
                          : "warning"
                      }
                    />
                  </Box>
                ))}
                {orders.length > 5 && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => setShowAllOrders((prev) => !prev)}
                    sx={{ alignSelf: "center", mt: 1 }}
                  >
                    {showAllOrders
                      ? t.showLess
                      : `${t.showAll} (${orders.length})`}
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </GlowCard>
      </Container>
    </PageContainer>
  );
};

export default DealerProfile;

