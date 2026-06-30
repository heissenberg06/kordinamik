import React, { useState, useEffect, useCallback } from 'react';
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
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  styled
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { dealerApplicationService } from '../services/api';

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'pending' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(status === 'approved' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === 'rejected' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
}));

const DetailCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: 'none',
  padding: '8px 16px',
}));


const DealerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params
      const params = {
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        status: statusFilter || undefined,
      };
      
      const response = await dealerApplicationService.getAllApplications(params);
      
      if (response.status === 'success') {
        setApplications(response.data.rows);
        setTotalCount(response.data.count);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load dealer applications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  // Open detail dialog
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  // Close detail dialog
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  // Open approve dialog
  const handleOpenApproveDialog = () => {
    setDetailDialogOpen(false);
    setApproveDialogOpen(true);
  };

  // Close approve dialog
  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
  };

  // Open reject dialog
  const handleOpenRejectDialog = () => {
    setDetailDialogOpen(false);
    setRejectDialogOpen(true);
  };

  // Close reject dialog
  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
  };

  // Approve application
  const handleApproveApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      setActionLoading(true);
      
      const response = await dealerApplicationService.approveApplication(selectedApplication.id);
      
      if (response.status === 'success') {
        // Close dialog and refresh applications
        setApproveDialogOpen(false);
        fetchApplications();
      } else {
        throw new Error('Failed to approve application');
      }
    } catch (err) {
      console.error('Error approving application:', err);
      setError('Failed to approve application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject application
  const handleRejectApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      setActionLoading(true);
      
      const response = await dealerApplicationService.rejectApplication(selectedApplication.id);
      
      if (response.status === 'success') {
        // Close dialog and refresh applications
        setRejectDialogOpen(false);
        fetchApplications();
      } else {
        throw new Error('Failed to reject application');
      }
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Failed to reject application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <PageHeader>
        <Typography variant="h1">Bayi Üye Başvuruları</Typography>
      </PageHeader>

      {/* Filters */}
      <FiltersContainer>
        <Button
          variant={statusFilter === 'pending' ? 'contained' : 'outlined'}
          onClick={() => handleStatusFilterChange('pending')}
        >
          Bekleyen Başvurular
        </Button>
        <Button
          variant={statusFilter === 'approved' ? 'contained' : 'outlined'}
          onClick={() => handleStatusFilterChange('approved')}
        >
          Onaylanan Başvurular
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'contained' : 'outlined'}
          onClick={() => handleStatusFilterChange('rejected')}
        >
          Reddedilen Başvurular
        </Button>
        <Button
          variant={!statusFilter ? 'contained' : 'outlined'}
          onClick={() => handleStatusFilterChange('')}
          startIcon={<FilterListIcon />}
        >
          Tümü
        </Button>
      </FiltersContainer>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Applications table */}
      <Paper sx={{ width: '100%', borderRadius: 3, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Şirket Adı</TableCell>
                  <TableCell>İletişim Kişisi</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Başvuru Tarihi</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <TableRow
                      key={application.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{application.company_name}</TableCell>
                      <TableCell>{application.contact_name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.phone}</TableCell>
                      <TableCell>{formatDate(application.created_at)}</TableCell>
                      <TableCell>
                        <StatusChip
                          label={
                            application.status === 'pending'
                              ? 'Bekliyor'
                              : application.status === 'approved'
                              ? 'Onaylandı'
                              : 'Reddedildi'
                          }
                          status={application.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewDetails(application)}
                          sx={{ mr: 1 }}
                        >
                          Detaylar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      {statusFilter
                        ? `Bu durumda başvuru bulunamadı: ${
                            statusFilter === 'pending'
                              ? 'Bekleyen'
                              : statusFilter === 'approved'
                              ? 'Onaylanan'
                              : 'Reddedilen'
                          }`
                        : 'Başvuru bulunamadı'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} / ${count !== -1 ? count : `${to} üzerinden`}`
          }
        />
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Bayi Başvuru Detayları
          {selectedApplication && (
            <StatusChip
              label={
                selectedApplication.status === 'pending'
                  ? 'Bekliyor'
                  : selectedApplication.status === 'approved'
                  ? 'Onaylandı'
                  : 'Reddedildi'
              }
              status={selectedApplication?.status}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DetailCard>
                  <CardContent>
                    <DetailLabel>Şirket Bilgileri</DetailLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <DetailLabel>Şirket Adı</DetailLabel>
                        <DetailValue>{selectedApplication.company_name}</DetailValue>
                      </Grid>
                      <Grid item xs={12}>
                        <DetailLabel>Vergi Numarası</DetailLabel>
                        <DetailValue>{selectedApplication.tax_id}</DetailValue>
                      </Grid>
                      <Grid item xs={12}>
                        <DetailLabel>Faaliyet Alanı</DetailLabel>
                        <DetailValue>{selectedApplication.business_area || '-'}</DetailValue>
                      </Grid>
                      <Grid item xs={12}>
                        <DetailLabel>Adres</DetailLabel>
                        <DetailValue>{selectedApplication.address}</DetailValue>
                      </Grid>
                    </Grid>
                  </CardContent>
                </DetailCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DetailCard>
                  <CardContent>
                    <DetailLabel>İletişim Bilgileri</DetailLabel>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <DetailLabel>İletişim Kişisi</DetailLabel>
                        <DetailValue>{selectedApplication.contact_name}</DetailValue>
                      </Grid>
                      <Grid item xs={12}>
                        <DetailLabel>E-posta</DetailLabel>
                        <DetailValue>{selectedApplication.email}</DetailValue>
                      </Grid>
                      <Grid item xs={12}>
                        <DetailLabel>Telefon</DetailLabel>
                        <DetailValue>{selectedApplication.phone}</DetailValue>
                      </Grid>
                    </Grid>
                  </CardContent>
                </DetailCard>
              </Grid>
              
              <Grid item xs={12}>
                <DetailCard>
                  <CardContent>
                    <DetailLabel>Notlar</DetailLabel>
                    <DetailValue sx={{ mt: 1 }}>
                      {selectedApplication.notes || 'Not bulunmamaktadır.'}
                    </DetailValue>
                  </CardContent>
                </DetailCard>
              </Grid>
              
              {selectedApplication.status === 'approved' && (
                <Grid item xs={12}>
                  <DetailCard sx={{ bgcolor: 'success.light' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon color="success" />
                        <Typography variant="h6" color="success.dark">
                          Onaylandı
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Bu başvuru {formatDate(selectedApplication.approved_at)} tarihinde onaylandı.
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <DetailLabel>Onay Kodu</DetailLabel>
                        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                          {selectedApplication.approval_code}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                          Bu kod bayi üyesine verilmelidir. Bayi üyesi bu kod ile sisteme giriş yapabilir.
                        </Typography>
                      </Box>
                    </CardContent>
                  </DetailCard>
                </Grid>
              )}
              
              {selectedApplication.status === 'rejected' && (
                <Grid item xs={12}>
                  <DetailCard sx={{ bgcolor: 'error.light' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CancelIcon color="error" />
                        <Typography variant="h6" color="error.dark">
                          Reddedildi
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Bu başvuru {formatDate(selectedApplication.approved_at)} tarihinde reddedildi.
                      </Typography>
                    </CardContent>
                  </DetailCard>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDetailDialog}>Kapat</Button>
          
          {selectedApplication && selectedApplication.status === 'pending' && (
            <>
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleOpenRejectDialog}
                startIcon={<CancelIcon />}
              >
                Reddet
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                onClick={handleOpenApproveDialog}
                startIcon={<CheckCircleIcon />}
              >
                Onayla
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCloseApproveDialog}
      >
        <DialogTitle>Başvuruyu Onayla</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu bayi başvurusunu onaylamak istediğinizden emin misiniz? Onaylandığında, başvuru sahibine bir onay kodu gönderilecektir.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog} disabled={actionLoading}>
            İptal
          </Button>
          <Button
            onClick={handleApproveApplication}
            variant="contained"
            color="success"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} color="inherit" />}
          >
            {actionLoading ? 'Onaylanıyor...' : 'Onayla'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
      >
        <DialogTitle>Başvuruyu Reddet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu bayi başvurusunu reddetmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} disabled={actionLoading}>
            İptal
          </Button>
          <Button
            onClick={handleRejectApplication}
            variant="contained"
            color="error"
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} color="inherit" />}
          >
            {actionLoading ? 'Reddediliyor...' : 'Reddet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DealerApplications;
