import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { orderService } from '../services/api';

const statusChip = (status) => {
  switch (status) {
    case 'approved':
      return <Chip label="Onaylandı" color="success" size="small" />;
    case 'rejected':
      return <Chip label="Reddedildi" color="error" size="small" />;
    default:
      return <Chip label="Bekliyor" color="warning" size="small" />;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.listOrders({
        status: statusFilter || undefined,
        limit: 100,
      });
      if (response.status === 'success') {
        setOrders(response.data.rows || []);
      } else {
        throw new Error('Siparişler alınamadı');
      }
    } catch (err) {
      console.error(err);
      setError('Siparişler yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setActionLoading(true);
      await orderService.updateStatus(orderId, status);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError('Durum güncellenemedi. Tekrar deneyin.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon fontSize="large" /> Siparişler
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant={statusFilter === '' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('')}
          >
            Tümü
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('pending')}
          >
            Bekleyen
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('approved')}
          >
            Onaylanan
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('rejected')}
          >
            Reddedilen
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 3, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Bayi</TableCell>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Toplam</TableCell>
                  <TableCell>Ürün</TableCell>
                  <TableCell>Not</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Sipariş bulunamadı.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.Dealer?.company_name || '-'}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        {(Number(order.total_amount) || 0).toLocaleString('tr-TR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        ₺
                      </TableCell>
                      <TableCell>{order.OrderItems?.length || 0}</TableCell>
                      <TableCell>{order.note ? order.note.slice(0, 40) + (order.note.length > 40 ? '…' : '') : '-'}</TableCell>
                      <TableCell>{statusChip(order.status)}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          Detay
                        </Button>
                        {order.status === 'pending' && (
                          <>
                            <Button
                              size="small"
                              color="success"
                              sx={{ mr: 1 }}
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleStatusUpdate(order.id, 'approved')}
                              disabled={actionLoading}
                            >
                              Onayla
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleStatusUpdate(order.id, 'rejected')}
                              disabled={actionLoading}
                            >
                              Reddet
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Sipariş Detayı #{selectedOrder?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography sx={{ mb: 1 }}>
                <strong>Bayi:</strong> {selectedOrder.Dealer?.company_name} ({selectedOrder.Dealer?.email})
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Tarih:</strong> {formatDate(selectedOrder.created_at)}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Durum:</strong> {statusChip(selectedOrder.status)}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Not:</strong>{' '}
                {selectedOrder.note && selectedOrder.note.trim().length > 0 ? selectedOrder.note : '—'}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Ürünler
              </Typography>
              <Grid container spacing={2}>
                {selectedOrder.OrderItems?.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {item.Product?.name} (Model: {item.Product?.model})
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        Adet: {item.quantity} | Birim Fiyat:{' '}
                        {(Number(item.unit_price) || 0).toLocaleString('tr-TR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        ₺
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        Toplam:{' '}
                        {(Number(item.total_price) || 0).toLocaleString('tr-TR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        ₺
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)}>Kapat</Button>
          {selectedOrder?.status === 'pending' && (
            <>
              <Button
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleStatusUpdate(selectedOrder.id, 'rejected')}
                disabled={actionLoading}
              >
                Reddet
              </Button>
              <Button
                color="success"
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleStatusUpdate(selectedOrder.id, 'approved')}
                disabled={actionLoading}
              >
                Onayla
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;

