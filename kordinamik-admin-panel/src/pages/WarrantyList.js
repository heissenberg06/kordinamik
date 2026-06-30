import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
import dayjs from 'dayjs';
import { warrantyService } from '../services/api';

const WarrantyList = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    product_id: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: rowsPerPage,
        offset: page * rowsPerPage
      };
      if (filters.product_id) params.product_id = filters.product_id;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const res = await warrantyService.list(params);
      setRows(res.data.rows || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Liste alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setPage(0);
    fetchData();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Garanti Kayıtları
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField label="Ürün ID" name="product_id" size="small" value={filters.product_id} onChange={handleFilterChange} />
          <TextField
            label="Başlangıç Tarihi"
            name="start_date"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.start_date}
            onChange={handleFilterChange}
          />
          <TextField
            label="Bitiş Tarihi"
            name="end_date"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.end_date}
            onChange={handleFilterChange}
          />
          <TextField
            label=" "
            size="small"
            value="Filtreleri uygula"
            InputProps={{
              readOnly: true,
              sx: { cursor: 'pointer', fontWeight: 600, color: 'primary.main' },
              onClick: handleApplyFilters
            }}
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ürün ID</TableCell>
                    <TableCell>Ürün</TableCell>
                    <TableCell>Müşteri</TableCell>
                    <TableCell>Telefon</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Kayıt Tarihi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.product_id}</TableCell>
                      <TableCell>{row.Product ? `${row.Product.name || ''} ${row.Product.model || ''}` : '-'}</TableCell>
                      <TableCell>{row.full_name}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{dayjs(row.created_at).format('YYYY-MM-DD HH:mm')}</TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Kayıt bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default WarrantyList;
