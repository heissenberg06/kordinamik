import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/api';

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  maxWidth: 800,
  margin: '0 auto',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ImagePreview = styled(Card)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  borderRadius: 8,
  overflow: 'hidden',
}));

const SimpleProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: 1, // Default to Kazanlar (ID: 1)
    model: '',
    description: '',
    is_active: true
  });
  
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [technicalDetailsImage, setTechnicalDetailsImage] = useState(null);
  const [technicalDetailsImagePreview, setTechnicalDetailsImagePreview] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Kazanlar' },
    { id: 2, name: 'Kuzineler' },
    { id: 3, name: 'Pellet Sistemler' }
  ]);
  
  // Fetch product data when in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        
        // Set form data
        setFormData({
          name: response.data.name || '',
          price: response.data.price || '',
          category_id: response.data.category_id || 1,
          model: response.data.model || '',
          description: response.data.description || '',
          is_active: response.data.is_active !== undefined ? response.data.is_active : true
        });

        // Load technical details image if exists
        if (response.data.technical_details_image) {
          setTechnicalDetailsImagePreview(response.data.technical_details_image);
        }
        
        // Handle product images
        if (response.data.ProductImages && response.data.ProductImages.length > 0) {
          const productImages = response.data.ProductImages.map(img => {
            try {
              // Convert image data to display format
              let imageUrl = null;
              
              if (img.image_data) {
                if (typeof img.image_data === 'string') {
                  imageUrl = `data:${img.image_type || 'image/jpeg'};base64,${img.image_data}`;
                } else if (Array.isArray(img.image_data)) {
                  const byteArray = new Uint8Array(img.image_data);
                  const binaryString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
                  const base64String = btoa(binaryString);
                  imageUrl = `data:${img.image_type || 'image/jpeg'};base64,${base64String}`;
                }
              }
              
              return {
                id: img.id,
                preview: imageUrl,
                is_primary: img.is_primary,
                name: img.image_name || 'Product image',
                existingImage: true
              };
            } catch (imgError) {
              console.error('Error processing image data:', imgError);
              return null;
            }
          }).filter(img => img !== null);
          
          // Sort images to put primary image first
          productImages.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
          
          setImages(productImages);
          
          // Set the first image as preview
          if (productImages.length > 0) {
            setImagePreview(productImages[0].preview);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id, isEditMode]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      const imageUrl = URL.createObjectURL(selectedImage);
      
      const newImage = {
        file: selectedImage,
        preview: imageUrl,
        is_primary: images.length === 0, // First image is primary by default
        name: selectedImage.name,
        existingImage: false
      };
      
      if (currentImageIndex !== null) {
        // Replace image at current index
        const updatedImages = [...images];
        updatedImages[currentImageIndex] = newImage;
        setImages(updatedImages);
      } else {
        // Add new image
        setImages([...images, newImage]);
      }
      
      setImagePreview(imageUrl);
      setCurrentImage(selectedImage);
      setCurrentImageIndex(null);
      setImageDialogOpen(false);
    }
  };
  
  // Handle image removal
  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    
    // Update primary image if needed
    if (updatedImages.length > 0 && images[index].is_primary) {
      updatedImages[0].is_primary = true;
    }
    
    setImages(updatedImages);
    
    // Update preview if needed
    if (updatedImages.length > 0) {
      setImagePreview(updatedImages[0].preview);
    } else {
      setImagePreview(null);
    }
  };
  
  // Set an image as primary
  const handleSetPrimary = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    
    setImages(updatedImages);
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
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      setError('Please enter product name and price');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Format data
      const productData = {
        name: formData.name,
        model: formData.model || formData.name, // Use name as model if not provided
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        is_active: true,
        stock: 0, // Default stock value
      };
      
      let productId;
      
      if (isEditMode) {
        const response = await productService.updateProduct(id, productData);
        console.log('Product updated:', response);
        productId = id;
      } else {
        try {
          const response = await productService.createProduct(productData);
          console.log('Product created:', response);
          productId = response.data?.id;
          
          if (!productId) {
            throw new Error('Failed to get product ID from response');
          }
        } catch (err) {
          console.error('Error creating product:', err.response?.data || err.message);
          throw err;
        }
      }
      
      // Upload images if selected
      if (images.length > 0 && productId) {
        try {
          console.log(`Uploading ${images.length} images for product:`, productId);
          
          // Process each image
          for (const image of images) {
            // Skip already existing images that weren't changed
            if (image.existingImage) continue;
            
            const imageResponse = await productService.uploadProductImage(productId, {
              file: image.file,
              isPrimary: image.is_primary
            });
            console.log('Image uploaded:', imageResponse);
          }
        } catch (imgErr) {
          console.error('Error uploading images:', imgErr.response?.data || imgErr.message);
          // Continue even if image upload fails
        }
      }

      // Upload technical details image if a new one was selected
      if (technicalDetailsImage && productId) {
        try {
          await productService.uploadTechnicalDetailsImage(productId, technicalDetailsImage);
        } catch (err) {
          console.error('Error uploading technical details image:', err);
        }
      }

      // Upload cover photo if a new one was selected
      if (coverPhoto && productId) {
        try {
          await productService.uploadCoverPhoto(productId, coverPhoto);
        } catch (err) {
          console.error('Error uploading cover photo:', err);
        }
      }
      
      // Navigate back to products list
      navigate('/dashboard/products');
      
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <PageHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard/products')}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h1">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </Box>
      </PageHeader>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <FormSection>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              
              <TextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              
              <TextField
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                inputProps={{ 
                  step: "0.01",
                  min: "0" 
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₺</Typography>,
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                name="model"
                label="Model"
                value={formData.model}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="Model number or identifier"
              />

              <TextField
                name="description"
                label="Product Explanation (Features & Description)"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={6}
                margin="normal"
                placeholder="Enter detailed product explanation that will be shown in the Features & Description tab..."
                helperText="This content will be displayed in the 'Özellikler & Açıklama' tab on the product detail page"
              />
            </FormSection>
            
            <FormSection>
              <Typography variant="h6" gutterBottom>
                Product Images
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternateIcon />}
                onClick={() => {
                  setCurrentImageIndex(null);
                  setImageDialogOpen(true);
                }}
                fullWidth
                sx={{ mb: 2 }}
              >
                Add Image
              </Button>
              
              {/* Image Grid */}
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ position: 'relative', height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="150"
                        image={image.preview}
                        alt={image.name}
                        sx={{ objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Image failed to load');
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        right: 0, 
                        display: 'flex',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        borderBottomLeftRadius: 8
                      }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveImage(index)}
                          sx={{ color: 'white' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ 
                          maxWidth: '70%', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {image.name}
                        </Typography>
                        <Button
                          size="small"
                          variant={image.is_primary ? "contained" : "outlined"}
                          color={image.is_primary ? "success" : "primary"}
                          onClick={() => handleSetPrimary(index)}
                          disabled={image.is_primary}
                          sx={{ minWidth: '60px', fontSize: '0.7rem' }}
                        >
                          {image.is_primary ? "Primary" : "Set Primary"}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
                
                {images.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      border: '2px dashed #ccc',
                      borderRadius: 2
                    }}>
                      <Typography color="textSecondary">
                        No images added yet. Click "Add Image" to upload product images.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
              
              <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
                <DialogTitle>Select Product Image</DialogTitle>
                <DialogContent>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="contained"
                      component="span"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Choose File
                    </Button>
                  </label>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
                </DialogActions>
              </Dialog>
            </FormSection>

            {/* Technical Details Image */}
            <FormSection>
              <Typography variant="h6" gutterBottom>
                Technical Details Image
              </Typography>
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
            </FormSection>

            {/* Cover Photo */}
            <FormSection>
              <Typography variant="h6" gutterBottom>
                Cover Photo
              </Typography>
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
            </FormSection>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Saving...' : 'Save Product'}
              </Button>
            </Box>
          </form>
        </FormContainer>
      )}
    </Box>
  );
};

export default SimpleProductForm;