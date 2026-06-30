import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  styled
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: 'none',
  padding: '8px 16px',
}));

const TableActionButton = styled(IconButton)(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: 8,
}));

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params
      const params = {
        offset: page * rowsPerPage,
        limit: rowsPerPage,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await productService.getAllProducts(params);
      setProducts(response.data.rows);
      setTotalCount(response.data.count);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, fetchProducts]);

  // Handle search
  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    fetchProducts();
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (event, product) => {
    event.stopPropagation();
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Confirm delete product
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader>
        <Typography variant="h1">Products</Typography>
        <ActionButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/products/new')}
        >
          Add Product
        </ActionButton>
      </PageHeader>

      {/* Filters */}
      <FiltersContainer>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
      </FiltersContainer>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products table */}
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
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
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
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <TableActionButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/products/edit/${product.id}`);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </TableActionButton>
                          <TableActionButton
                            color="error"
                            onClick={(e) => handleDeleteClick(e, product)}
                          >
                            <DeleteIcon fontSize="small" />
                          </TableActionButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No products found
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
        />
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={20} color="inherit" />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
