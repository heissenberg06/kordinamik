import React, { useEffect, useState, useCallback } from 'react';
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
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import { dealerService } from '../services/api';

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
}));

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealerToDelete, setDealerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDealers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dealerService.getAllDealers();
      if (response.status === 'success') {
        setDealers(response.data);
      } else {
        throw new Error('Failed to fetch dealers');
      }
    } catch (err) {
      console.error('Error fetching dealers:', err);
      setError('Bayiler yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

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

  const handleDeleteClick = (event, dealer) => {
    event.stopPropagation();
    setDealerToDelete(dealer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDealerToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!dealerToDelete) return;
    try {
      setDeleteLoading(true);
      await dealerService.deleteDealer(dealerToDelete.id);
      setDeleteDialogOpen(false);
      setDealerToDelete(null);
      fetchDealers();
    } catch (err) {
      console.error('Error deleting dealer:', err);
      setError('Bayi silinemedi. Lütfen tekrar deneyin.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader>
        <Typography variant="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon fontSize="large" /> Bayiler
        </Typography>
      </PageHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Firma</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Yetkili</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Telefon</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Şehir</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Onay Kodu</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Kayıt Tarihi</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dealers.length > 0 ? (
                  dealers.map((dealer) => (
                    <TableRow
                      key={dealer.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setSelectedDealer(dealer)}
                    >
                      <TableCell>{dealer.company_name}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{dealer.contact_name}</TableCell>
                      <TableCell>{dealer.email}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{dealer.phone}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{dealer.DealerApplication?.city || '-'}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{dealer.approval_code || dealer.DealerApplication?.approval_code || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={dealer.is_active ? 'Aktif' : 'Pasif'}
                          color={dealer.is_active ? 'success' : 'default'}
                          size="small"
                          icon={dealer.is_active ? <CheckCircleIcon /> : <BlockIcon />}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{formatDate(dealer.created_at)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Sil">
                          <IconButton
                            color="error"
                            onClick={(e) => handleDeleteClick(e, dealer)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      Kayıtlı bayi bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Detail dialog */}
      <Dialog
        open={Boolean(selectedDealer)}
        onClose={() => setSelectedDealer(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bayi Detayları</DialogTitle>
        <DialogContent dividers>
          {selectedDealer && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <InfoCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Firma Bilgileri</Typography>
                    <Typography><strong>Firma:</strong> {selectedDealer.company_name}</Typography>
                    <Typography><strong>Vergi No:</strong> {selectedDealer.tax_id}</Typography>
                    <Typography><strong>Faaliyet:</strong> {selectedDealer.business_type || '-'}</Typography>
                    <Typography><strong>Adres:</strong> {selectedDealer.address || selectedDealer.DealerApplication?.address || '-'}</Typography>
                    <Typography><strong>Şehir:</strong> {selectedDealer.DealerApplication?.city || '-'}</Typography>
                  </CardContent>
                </InfoCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>İletişim</Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" /> {selectedDealer.contact_name}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" /> {selectedDealer.email}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" /> {selectedDealer.phone}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HomeIcon fontSize="small" /> {selectedDealer.address || '-'}
                    </Typography>
                  </CardContent>
                </InfoCard>
              </Grid>
              <Grid item xs={12}>
                <InfoCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Başvuru Bilgileri</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography><strong>Başvuru ID:</strong> {selectedDealer.application_id || selectedDealer.DealerApplication?.id || '-'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography><strong>Onay Kodu:</strong> {selectedDealer.approval_code || selectedDealer.DealerApplication?.approval_code || '-'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography><strong>Durum:</strong> {selectedDealer.DealerApplication?.status || 'approved'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography><strong>Oluşturma:</strong> {formatDate(selectedDealer.created_at)}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography><strong>Son Giriş:</strong> {formatDate(selectedDealer.last_login)}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography><strong>Başvuru Tarihi:</strong> {formatDate(selectedDealer.DealerApplication?.created_at)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </InfoCard>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Bayi Silinsin mi?</DialogTitle>
        <DialogContent>
          <Typography>
            {`"${dealerToDelete?.company_name || ''}" bayisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          </Typography>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2 }}>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>Vazgeç</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Siliniyor...' : 'Sil'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Dealers;

