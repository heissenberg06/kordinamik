import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  IconButton,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../components/LanguageContext";

const translations = {
  tr: {
    title: "Sepetim",
    backToProducts: "Ürünlere dön",
    emptyTitle: "Sepetiniz boş",
    emptySubtitle: "Ürün eklemek için listeye göz atın.",
    goToProducts: "Ürünlere Git",
    orderSummary: "Sipariş Özeti",
    noteLabel: "Not (opsiyonel)",
    total: "Toplam",
    quantity: "Adet",
    sending: "Gönderiliyor...",
    placeOrder: "Siparişi Gönder",
    clearCart: "Sepeti Temizle",
    clearCartTitle: "Sepeti Temizle",
    clearCartConfirm: "Sepetteki tüm ürünler silinecek. Emin misiniz?",
    cancel: "İptal",
    confirmClear: "Evet, Temizle",
    loginRequired: "Siparişi tamamlamak için lütfen giriş yapın.",
    errorEmpty: "Sepetiniz boş.",
    successOrder: "Siparişiniz alındı. Onay için admin paneline iletildi.",
    errorOrder: "Sipariş gönderilemedi.",
  },
  en: {
    title: "My Cart",
    backToProducts: "Back to products",
    emptyTitle: "Your cart is empty",
    emptySubtitle: "Browse the product list to add items.",
    goToProducts: "Go to Products",
    orderSummary: "Order Summary",
    noteLabel: "Note (optional)",
    total: "Total",
    quantity: "Qty",
    sending: "Sending...",
    placeOrder: "Place Order",
    clearCart: "Clear Cart",
    clearCartTitle: "Clear Cart",
    clearCartConfirm: "All items in the cart will be removed. Are you sure?",
    cancel: "Cancel",
    confirmClear: "Yes, Clear",
    loginRequired: "Please log in to complete your order.",
    errorEmpty: "Your cart is empty.",
    successOrder: "Your order has been received and forwarded for approval.",
    errorOrder: "Failed to place order.",
  },
  ru: {
    title: "Моя корзина",
    backToProducts: "Назад к товарам",
    emptyTitle: "Ваша корзина пуста",
    emptySubtitle: "Просмотрите список товаров для добавления.",
    goToProducts: "К товарам",
    orderSummary: "Сводка заказа",
    noteLabel: "Примечание (необязательно)",
    total: "Итого",
    quantity: "Кол-во",
    sending: "Отправка...",
    placeOrder: "Оформить заказ",
    clearCart: "Очистить корзину",
    clearCartTitle: "Очистить корзину",
    clearCartConfirm: "Все товары в корзине будут удалены. Вы уверены?",
    cancel: "Отмена",
    confirmClear: "Да, очистить",
    loginRequired: "Пожалуйста, войдите для оформления заказа.",
    errorEmpty: "Ваша корзина пуста.",
    successOrder: "Ваш заказ принят и направлен на подтверждение.",
    errorOrder: "Не удалось оформить заказ.",
  },
};
import { useCart } from "../components/CartContext";
import { useDealer } from "../components/DealerContext";

const API_URL = API_BASE_URL;

const PageContainer = styled(Box)({
  minHeight: "90vh",
  paddingTop: "100px",
  paddingBottom: "60px",
  backgroundColor: "#f9fafb",
});

const Container = styled(Box)({
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "0 20px",
});

const TitleRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "20px",
  gap: "12px",
});

const CartCard = styled(Card)({
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
});

const SummaryCard = styled(Card)({
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  position: "sticky",
  top: 120,
});

const EmptyState = styled(Box)({
  textAlign: "center",
  padding: "60px 20px",
  background: "white",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
});

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.tr;
  const { isAuthenticated, getAuthHeader } = useDealer();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const navigate = useNavigate();

  const totalAmount = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const line = Number(item.price || 0) * Number(item.quantity || 0);
        return sum + line;
      }, 0),
    [cartItems]
  );

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate("/giris/bayi");
      return;
    }

    if (cartItems.length === 0) {
      setFeedback({ type: "error", text: t.errorEmpty });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await axios.post(
        `${API_URL}/dealer/orders`,
        {
          items: cartItems.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          note,
        },
        { headers: { ...getAuthHeader() } }
      );

      setFeedback({
        type: "success",
        text: t.successOrder,
      });
      clearCart();
      setNote("");
    } catch (error) {
      setFeedback({
        type: "error",
        text: error.response?.data?.message || t.errorOrder,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <PageContainer>
        <Container>
          <TitleRow>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingCartIcon color="error" />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {t.title}
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/urunlerimiz"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
            >
              {t.backToProducts}
            </Button>
          </TitleRow>
          <EmptyState>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t.emptyTitle}
            </Typography>
            <Typography sx={{ color: "#6b7280", mb: 3 }}>
              {t.emptySubtitle}
            </Typography>
            <Button
              variant="contained"
              color="error"
              component={Link}
              to="/urunlerimiz"
            >
              {t.goToProducts}
            </Button>
          </EmptyState>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <TitleRow>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingCartIcon color="error" />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Sepetim
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/urunlerimiz"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Ürünlere dön
          </Button>
        </TitleRow>

        {feedback && (
          <Alert severity={feedback.type} sx={{ mb: 2 }}>
            {feedback.text}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 3,
          }}
        >
          <CartCard>
            <CardContent>
              {cartItems.map((item, index) => (
                <Box key={item.productId}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        item.image ||
                        "https://via.placeholder.com/120x100?text=Kordinamik"
                      }
                      alt={item.name}
                      sx={{
                        width: 120,
                        height: 100,
                        objectFit: "contain",
                        backgroundColor: "#f3f4f6",
                        borderRadius: 2,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography sx={{ color: "#6b7280" }}>
                        Model: {item.model}
                      </Typography>
                      <Typography sx={{ color: "#dc2626", fontWeight: 700 }}>
                        {Number(item.price || 0).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} ₺
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        label={t.quantity}
                        inputProps={{ min: 1 }}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId, e.target.value)
                        }
                        sx={{ width: 100 }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ minWidth: 140, textAlign: "right" }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} ₺
                      </Typography>
                    </Box>
                  </Box>
                  {index < cartItems.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </CartCard>

          <SummaryCard>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6">{t.orderSummary}</Typography>
              <TextField
                label={t.noteLabel}
                multiline
                minRows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                <span>{t.total}</span>
                <span>
                  {Number(totalAmount || 0).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ₺
                </span>
              </Box>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? t.sending : t.placeOrder}
              </Button>
              <Button
                variant="text"
                color="inherit"
                onClick={() => setClearDialogOpen(true)}
                disabled={submitting}
              >
                {t.clearCart}
              </Button>

              <Dialog
                open={clearDialogOpen}
                onClose={() => setClearDialogOpen(false)}
              >
                <DialogTitle>{t.clearCartTitle}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t.clearCartConfirm}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setClearDialogOpen(false)}>
                    {t.cancel}
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => { clearCart(); setClearDialogOpen(false); }}
                  >
                    {t.confirmClear}
                  </Button>
                </DialogActions>
              </Dialog>
              {!isAuthenticated && (
                <Alert severity="info">
                  {t.loginRequired}
                </Alert>
              )}
            </CardContent>
          </SummaryCard>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default Cart;

