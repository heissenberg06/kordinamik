import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress, Button, styled, Divider, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDealer } from "../components/DealerContext";
import axios from "axios";
import { API_BASE_URL } from "../config";

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
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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
            Oturum bulunamadı. Lütfen giriş yapın.
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
              Bayi Profilim
            </Typography>
            <Typography sx={{ color: "#475569", mt: 0.5 }}>
              Hesap bilgilerin ve son giriş detayların burada.
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
            Çıkış Yap
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
                  Yetkili
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.contact_name}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  E-posta
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.email}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  Telefon
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.phone}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  Vergi No
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.tax_id}</Typography>
              </StatCard>
            </StatGrid>

            <StatGrid>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  Adres
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.address || "-"}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  Faaliyet Alanı
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.business_type || "-"}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  Onay Kodu
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{dealer.approval_code || "-"}</Typography>
              </StatCard>
              <StatCard>
                <Typography variant="body2" sx={{ textTransform: "uppercase", letterSpacing: 0.6, color: "#94a3b8" }}>
                  Son Giriş
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
              Son Siparişlerim
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              Verdiğiniz siparişlerin durumu burada listelenir.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {ordersLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={26} />
              </Box>
            ) : orders.length === 0 ? (
              <Typography sx={{ color: "#94a3b8" }}>
                Henüz sipariş bulunmuyor.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {orders.slice(0, 5).map((order) => (
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
                        Sipariş #{order.id}
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
                        {order.OrderItems?.length || 0} ürün
                      </Typography>
                    </Box>
                    <Chip
                      label={
                        order.status === "approved"
                          ? "Onaylandı"
                          : order.status === "rejected"
                          ? "Reddedildi"
                          : "Beklemede"
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
              </Box>
            )}
          </CardContent>
        </GlowCard>
      </Container>
    </PageContainer>
  );
};

export default DealerProfile;

