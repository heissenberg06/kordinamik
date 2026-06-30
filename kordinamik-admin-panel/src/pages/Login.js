import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
  padding: theme.spacing(3),
}));

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: '100%',
  borderRadius: 30,
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  border: '1px solid rgba(220, 38, 38, 0.1)',
  overflow: 'visible',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  '& svg': {
    fontSize: 60,
    color: theme.palette.primary.main,
  },
}));

const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: '15px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
  '&:hover': {
    boxShadow: '0 15px 35px rgba(220, 38, 38, 0.4)',
  },
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login with:', { username, password });
    const success = await login({ username, password });
    console.log('Login result:', success);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <CardContent sx={{ padding: 5 }}>
          <LogoContainer>
            <AdminPanelSettingsIcon />
          </LogoContainer>

          <Typography variant="h1" align="center" gutterBottom>
            Admin Panel
          </Typography>

          <Typography 
            variant="body1" 
            align="center" 
            color="textSecondary" 
            sx={{ mb: 4 }}
          >
            Enter your credentials to access the admin panel
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FormField>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <FormField>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormField>

            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Logging in...' : 'Login'}
            </SubmitButton>
          </form>
        </CardContent>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
