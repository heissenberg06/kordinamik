import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate, useParams } from 'react-router-dom';
import { productService, categoryService } from '../services/api';

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
}));

const ImageCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover .image-actions': {
    opacity: 1,
  },
}));

const ImageActions = styled(CardActions)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ImageUploadButton = styled(Button)(({ theme }) => ({
  borderStyle: 'dashed',
  borderWidth: 2,
  borderRadius: 12,
  height: '100%',
  minHeight: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    description: '',
    price: '',
    stock: 0,
    category_id: '',
    fuel_type: '',
    warranty_months: '',
    features: {},
    is_active: true,
  });
  
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const [technicalDetailsImage, setTechnicalDetailsImage] = useState(null);
  const [technicalDetailsImagePreview, setTechnicalDetailsImagePreview] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProductData = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        const product = response.data;
        
        setFormData({
          name: product.name || '',
          model: product.model || '',
          description: product.description || '',
          price: product.price || '',
          stock: product.stock || 0,
          category_id: product.category_id || '',
          fuel_type: product.fuel_type || '',
          warranty_months: product.warranty_months || '',
          features: product.features || {},
          is_active: product.is_active !== undefined ? product.is_active : true,
        });
        
        if (product.ProductImages) {
          setImages(product.ProductImages);
        }

        // Load technical details image if exists
        if (product.technical_details_image) {
          setTechnicalDetailsImagePreview(product.technical_details_image);
        }

        // Load cover photo if exists (find primary image)
        if (product.ProductImages && product.ProductImages.length > 0) {
          const primaryImage = product.ProductImages.find(img => img.is_primary);
          if (primaryImage) {
            const coverPhotoUrl = `data:${primaryImage.image_type};base64,${primaryImage.image_data}`;
            setCoverPhotoPreview(coverPhotoUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id, isEditMode]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      
      // Format data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        warranty_months: formData.warranty_months ? parseInt(formData.warranty_months, 10) : null,
      };
      
      let productId = id;
      
      if (isEditMode) {
        await productService.updateProduct(id, productData);
      } else {
        const response = await productService.createProduct(productData);
        productId = response.data.id;
      }

      // Upload technical details image if a new one was selected
      if (technicalDetailsImage) {
        await productService.uploadTechnicalDetailsImage(productId, technicalDetailsImage);
      }

      // Upload cover photo if a new one was selected
      if (coverPhoto) {
        await productService.uploadCoverPhoto(productId, coverPhoto);
      }

      if (!isEditMode) {
        // Navigate to edit page for the new product
        navigate(`/dashboard/products/edit/${productId}`);
        return;
      }
      
      // Navigate back to products list
      navigate('/dashboard/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please check your input and try again.');
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Handle image upload dialog
  const handleImageUploadOpen = () => {
    setImageUploadOpen(true);
  };
  
  const handleImageUploadClose = () => {
    setImageUploadOpen(false);
    setUploadFile(null);
    setIsPrimary(false);
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };
  
  const handleUploadImage = async () => {
    if (!uploadFile) return;
    
    try {
      setUploadLoading(true);
      
      await productService.uploadProductImage(id, {
        file: uploadFile,
        isPrimary
      });
      
      // Refresh product data to get updated images
      const response = await productService.getProductById(id);
      setImages(response.data.ProductImages || []);
      
      handleImageUploadClose();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };
  
  // Handle setting primary image
  const handleSetPrimaryImage = async (imageId) => {
    try {
      // First upload as primary
      await productService.uploadProductImage(id, {
        imageId,
        isPrimary: true
      });
      
      // Refresh product data
      const response = await productService.getProductById(id);
      setImages(response.data.ProductImages || []);
    } catch (err) {
      console.error('Error setting primary image:', err);
      setError('Failed to set primary image. Please try again.');
    }
  };
  
  // Handle image deletion
  const handleDeleteImage = async (imageId) => {
    setDeleteImageId(imageId);
  };
  
  const confirmDeleteImage = async () => {
    if (!deleteImageId) return;
    
    try {
      setDeleteImageLoading(true);
      await productService.deleteProductImage(id, deleteImageId);
      
      // Refresh product data
      const response = await productService.getProductById(id);
      setImages(response.data.ProductImages || []);
      
      setDeleteImageId(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    } finally {
      setDeleteImageLoading(false);
    }
  };
  
  const cancelDeleteImage = () => {
    setDeleteImageId(null);
  };

  // Handle technical details image upload
  const handleTechnicalDetailsImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTechnicalDetailsImage(file);
      setTechnicalDetailsImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle cover photo upload
  const handleCoverPhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhoto(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Remove technical details image
  const removeTechnicalDetailsImage = () => {
    setTechnicalDetailsImage(null);
    setTechnicalDetailsImagePreview(null);
  };

  // Remove cover photo
  const removeCoverPhoto = () => {
    setCoverPhoto(null);
    setCoverPhotoPreview(null);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <PageHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/dashboard/products')}
            sx={{ 
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              '&:hover': { backgroundColor: 'background.paper' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h1">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSubmit}
          disabled={saveLoading}
        >
          {saveLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </PageHeader>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={8}>
            <FormSection>
              <FormPaper>
                <SectionTitle>Basic Information</SectionTitle>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Product Name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="model"
                      label="Model"
                      value={formData.model}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="category_id"
                      label="Category"
                      select
                      value={formData.category_id}
                      onChange={handleChange}
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Product Explanation (Features & Description)"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="Enter detailed product explanation that will be shown in the Features & Description tab..."
                      helperText="This content will be displayed in the 'Özellikler & Açıklama' tab on the product detail page"
                    />
                  </Grid>
                </Grid>
              </FormPaper>
            </FormSection>
            
            {/* Pricing & Inventory */}
            <FormSection>
              <FormPaper>
                <SectionTitle>Pricing & Inventory</SectionTitle>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="price"
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="stock"
                      label="Stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </FormPaper>
            </FormSection>
            
            {/* Additional Details */}
            <FormSection>
              <FormPaper>
                <SectionTitle>Additional Details</SectionTitle>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="fuel_type"
                      label="Fuel Type"
                      value={formData.fuel_type}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="warranty_months"
                      label="Warranty (Months)"
                      type="number"
                      value={formData.warranty_months}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.is_active}
                          onChange={handleChange}
                          name="is_active"
                          color="primary"
                        />
                      }
                      label="Active"
                    />
                  </Grid>
                </Grid>
              </FormPaper>
            </FormSection>

            {/* Technical Details Image */}
            <FormSection>
              <FormPaper>
                <SectionTitle>Technical Details Image</SectionTitle>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload an image that will be displayed in the "Teknik Detaylar" tab
                  </Typography>
                  
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="technical-details-upload"
                    type="file"
                    onChange={handleTechnicalDetailsImageChange}
                  />
                  <label htmlFor="technical-details-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AddPhotoAlternateIcon />}
                      sx={{ mb: 2 }}
                    >
                      Select Technical Details Image
                    </Button>
                  </label>
                  
                  {technicalDetailsImagePreview && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <img
                        src={technicalDetailsImagePreview}
                        alt="Technical Details Preview"
                        style={{ 
                          width: '100%', 
                          maxHeight: '300px', 
                          objectFit: 'contain',
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
                        }}
                      />
                      <IconButton
                        onClick={removeTechnicalDetailsImage}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                        }}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      {!technicalDetailsImage && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: '0.75rem',
                          }}
                        >
                          Current Image
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </FormPaper>
            </FormSection>

            {/* Cover Photo */}
            <FormSection>
              <FormPaper>
                <SectionTitle>Cover Photo</SectionTitle>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload a cover photo that will be displayed on the products listing page (Urunlerimiz)
                  </Typography>
                  
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="cover-photo-upload"
                    type="file"
                    onChange={handleCoverPhotoChange}
                  />
                  <label htmlFor="cover-photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AddPhotoAlternateIcon />}
                      sx={{ mb: 2 }}
                    >
                      Select Cover Photo
                    </Button>
                  </label>
                  
                  {coverPhotoPreview && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <img
                        src={coverPhotoPreview}
                        alt="Cover Photo Preview"
                        style={{ 
                          width: '100%', 
                          maxHeight: '300px', 
                          objectFit: 'contain',
                          borderRadius: 8,
                          border: '1px solid #e0e0e0'
                        }}
                      />
                      <IconButton
                        onClick={removeCoverPhoto}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                        }}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      {!coverPhoto && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: '0.75rem',
                          }}
                        >
                          Current Cover Photo
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </FormPaper>
            </FormSection>
          </Grid>
          
          {/* Product Images */}
          <Grid item xs={12} md={4}>
            <FormPaper>
              <SectionTitle>Product Images</SectionTitle>
              
              {isEditMode ? (
                <Box>
                  <Grid container spacing={2}>
                    {images.length > 0 ? (
                      images.map((image) => (
                        <Grid item xs={12} key={image.id}>
                          <ImageCard>
                            <CardMedia
                              component="img"
                              height="200"
                              image={`data:${image.image_type};base64,${image.image_data}`}
                              alt={image.image_name}
                            />
                            <ImageActions className="image-actions">
                              <IconButton
                                size="small"
                                color={image.is_primary ? "warning" : "default"}
                                onClick={() => handleSetPrimaryImage(image.id)}
                                disabled={image.is_primary}
                              >
                                {image.is_primary ? <StarIcon /> : <StarBorderIcon />}
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ImageActions>
                            {image.is_primary && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                  bgcolor: 'warning.main',
                                  color: 'white',
                                  borderRadius: 1,
                                  px: 1,
                                  py: 0.5,
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                }}
                              >
                                Primary
                              </Box>
                            )}
                          </ImageCard>
                        </Grid>
                      ))
                    ) : (
                      <Typography color="text.secondary" align="center" sx={{ mb: 2 }}>
                        No images uploaded yet
                      </Typography>
                    )}
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={handleImageUploadOpen}
                        fullWidth
                      >
                        Add Image
                      </Button>
                    </Grid>
                  </Grid>
                  
                  {/* Image Upload Dialog */}
                  <Dialog open={imageUploadOpen} onClose={handleImageUploadClose}>
                    <DialogTitle>Upload Product Image</DialogTitle>
                    <DialogContent>
                      <Box sx={{ mt: 2 }}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="image-upload"
                          type="file"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<AddPhotoAlternateIcon />}
                            fullWidth
                            sx={{ mb: 2 }}
                          >
                            Select Image
                          </Button>
                        </label>
                        
                        {uploadFile && (
                          <Box sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Selected: {uploadFile.name}
                            </Typography>
                            <img
                              src={URL.createObjectURL(uploadFile)}
                              alt="Preview"
                              style={{ 
                                width: '100%', 
                                maxHeight: '200px', 
                                objectFit: 'contain',
                                borderRadius: 8 
                              }}
                            />
                          </Box>
                        )}
                        
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isPrimary}
                              onChange={(e) => setIsPrimary(e.target.checked)}
                              name="isPrimary"
                              color="primary"
                            />
                          }
                          label="Set as primary image"
                        />
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleImageUploadClose}>Cancel</Button>
                      <Button
                        onClick={handleUploadImage}
                        color="primary"
                        variant="contained"
                        disabled={!uploadFile || uploadLoading}
                        startIcon={uploadLoading && <CircularProgress size={20} color="inherit" />}
                      >
                        {uploadLoading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </DialogActions>
                  </Dialog>
                  
                  {/* Delete Image Confirmation Dialog */}
                  <Dialog open={!!deleteImageId} onClose={cancelDeleteImage}>
                    <DialogTitle>Delete Image</DialogTitle>
                    <DialogContent>
                      <Typography>
                        Are you sure you want to delete this image? This action cannot be undone.
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={cancelDeleteImage}>Cancel</Button>
                      <Button
                        onClick={confirmDeleteImage}
                        color="error"
                        variant="contained"
                        disabled={deleteImageLoading}
                        startIcon={deleteImageLoading && <CircularProgress size={20} color="inherit" />}
                      >
                        {deleteImageLoading ? 'Deleting...' : 'Delete'}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              ) : (
                <Box>
                  <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
                    You can add images after creating the product
                  </Typography>
                  <ImageUploadButton
                    variant="outlined"
                    color="primary"
                    disabled
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                    <Typography color="text.disabled">
                      Save product first
                    </Typography>
                  </ImageUploadButton>
                </Box>
              )}
            </FormPaper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProductForm;
