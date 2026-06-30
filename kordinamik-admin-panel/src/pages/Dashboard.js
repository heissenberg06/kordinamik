import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { productService, dealerService, orderService } from '../services/api';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StoreIcon from '@mui/icons-material/Store';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  },
}));

const StatCard = styled(StyledCard)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    background: 'rgba(220, 38, 38, 0.05)',
    borderRadius: '0 0 0 100%',
  },
}));

const StatIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: 12,
  background: 'rgba(220, 38, 38, 0.1)',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 30,
    color: theme.palette.primary.main,
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  position: 'relative',
  paddingLeft: theme.spacing(1.5),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 4,
    height: '70%',
    background: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: 'none',
  padding: '8px 16px',
}));

const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [ordersDay, setOrdersDay] = useState({ count: 0, total: 0 });
  const [ordersMonth, setOrdersMonth] = useState({ count: 0, total: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch product count and recent products
        const productsResponse = await productService.getAllProducts({ 
          limit: 5, 
          sort_by: 'created_at', 
          sort_dir: 'DESC' 
        });
        
        setProductCount(productsResponse.data.count);
        setRecentProducts(productsResponse.data.rows);
        
        // Fetch dealer count
        const dealersResponse = await dealerService.getAllDealers();
        if (dealersResponse.status === 'success') {
          setDealerCount(dealersResponse.data.length);
        }

        // Orders summaries
        const [daySummary, monthSummary] = await Promise.all([
          orderService.summary({ last_days: 1 }),
          orderService.summary({ last_days: 30 }),
        ]);
        if (daySummary.status === 'success') {
          setOrdersDay({
            count: daySummary.data.count,
            total: daySummary.data.total_amount,
          });
        }
        if (monthSummary.status === 'success') {
          setOrdersMonth({
            count: monthSummary.data.count,
            total: monthSummary.data.total_amount,
          });
        }

        setOrdersLoading(true);
        const recentOrdersResp = await orderService.listOrders({
          limit: 5,
          sort_by: 'created_at',
          sort_dir: 'DESC',
          last_days: 30,
        });
        if (recentOrdersResp.status === 'success') {
          setRecentOrders(recentOrdersResp.data.rows || []);
        }
        setOrdersLoading(false);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('tr-TR');
  };

  const formatCurrency = (val) =>
    Number(val || 0).toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats + Recent Orders row (fixed side-by-side with horizontal scroll if needed) */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          gap: 3,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          alignItems: 'stretch',
          pb: 1,
        }}
      >
        <Box sx={{ flex: '0 0 auto', minWidth: 720 }}>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={6} md={6} lg={3}>
              <StatCard sx={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffe7e7 100%)', height: 230 }}>
                <CardContent>
                  <StatIcon>
                    <InventoryIcon />
                  </StatIcon>
                  <StatValue>{productCount}</StatValue>
                  <StatLabel>Toplam Ürün</StatLabel>
                </CardContent>
              </StatCard>
            </Grid>
            
            <Grid item xs={6} sm={6} md={6} lg={3}>
              <StatCard sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', height: 230 }}>
                <CardContent>
                  <StatIcon>
                    <PeopleIcon />
                  </StatIcon>
                  <StatValue>{dealerCount}</StatValue>
                  <StatLabel>Toplam Bayi</StatLabel>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={3}>
              <StatCard sx={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', height: 230 }}>
                <CardContent>
                  <StatIcon>
                    <ShoppingCartIcon />
                  </StatIcon>
                  <StatValue>{ordersDay.count}</StatValue>
                  <StatLabel>Son 24 Saat Sipariş</StatLabel>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Toplam: {formatCurrency(ordersDay.total)} ₺
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={3}>
              <StatCard sx={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', height: 230 }}>
                <CardContent>
                  <StatIcon>
                    <ShoppingCartIcon />
                  </StatIcon>
                  <StatValue>{ordersMonth.count}</StatValue>
                  <StatLabel>Son 30 Gün Sipariş</StatLabel>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Toplam: {formatCurrency(ordersMonth.total)} ₺
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ flex: '1 1 0%', minWidth: 400 }}>
          <StatCard sx={{ height: 230, display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ReceiptLongIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Son Siparişler
                </Typography>
              </Box>
              <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5, maxHeight: 140 }}>
                {ordersLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : recentOrders.length === 0 ? (
                  <Typography color="text.secondary">Sipariş bulunamadı.</Typography>
                ) : (
                  <Box>
                    {recentOrders.map((order, idx) => {
                      const productsSummary = (order.OrderItems || [])
                        .map((item) => `${item.Product?.name || 'Ürün'} x${item.quantity}`)
                        .join(', ');
                      return (
                        <Box
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': { backgroundColor: 'rgba(220,38,38,0.06)' },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {order.Dealer?.company_name || 'Bayi'}
                              </Typography>
                              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.9rem' }}>
                                <CalendarMonthIcon fontSize="small" /> {formatDate(order.created_at)}
                              </Typography>
                              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {productsSummary || 'Ürün detayı yok'}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 800, color: 'primary.main', minWidth: 110, textAlign: 'right' }}>
                              {formatCurrency(order.total_amount)} ₺
                            </Typography>
                          </Box>
                          {idx < recentOrders.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </CardContent>
          </StatCard>
        </Box>
      </Box>
      
      {/* Recent Products */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionTitle variant="h2">
            Recent Products
          </SectionTitle>
          <ActionButton 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/products/new')}
          >
            Add Product
          </ActionButton>
        </Box>
        
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <TableRow 
                    key={product.id}
                    hover
                    onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {Number(product.price || 0).toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ₺
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Order detail dialog */}
      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Sipariş Detayı #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography sx={{ mb: 1 }}>
                <strong>Bayi:</strong> {selectedOrder.Dealer?.company_name || '-'} ({selectedOrder.Dealer?.email || '-'})
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Tarih:</strong> {formatDate(selectedOrder.created_at)}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Toplam:</strong> {formatCurrency(selectedOrder.total_amount)} ₺
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Durum:</strong> {selectedOrder.status}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Ürünler
              </Typography>
              {(selectedOrder.OrderItems || []).map((item) => (
                <Box key={item.id} sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {item.Product?.name || 'Ürün'} (Model: {item.Product?.model || '-'})
                  </Typography>
                  <Typography color="text.secondary">
                    Adet: {item.quantity} | Birim Fiyat: {formatCurrency(item.unit_price)} ₺ | Toplam: {formatCurrency(item.total_price)} ₺
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)}>Kapat</Button>
          {selectedOrder && (
            <Button
              onClick={() => {
                setSelectedOrder(null);
                navigate('/dashboard/orders');
              }}
              variant="contained"
              color="primary"
              startIcon={<StoreIcon />}
            >
              Siparişe Git
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
