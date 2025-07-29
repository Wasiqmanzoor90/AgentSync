'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography,
  Paper,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import { 
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Color palette for consistent theming
const COLORS = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  surface: '#ffffff',
  background: '#f8fafc',
  border: '#e2e8f0',
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    muted: '#94a3b8'
  },
  google: '#4285f4',
  googleHover: '#3367d6',
  github: '#24292e',
  githubHover: '#1a1e22',
  error: '#ef4444',
  success: '#10b981'
};

// Custom Google Icon Component (SVG for authentic colors)
const GoogleIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285f4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34a853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#fbbc05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#ea4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Custom GitHub Icon Component (SVG for authentic colors)
const GitHubIconSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#24292e">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

function RegisterForm() {
  const router = useRouter();
  
  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // GitHub OAuth registration
  const handleGitHubSignup = async () => {
    try {
      setLoading(true);
      await signIn('github');
    } catch (error) {
      console.error('GitHub signup error:', error);
      setError('GitHub signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth registration
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signIn('google');
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Google signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const isStrongPassword = (password: string) => {
    return password.length >= 8;
  };

  // Handle form submission for email/password registration
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Basic validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Account created successfully! You can now sign in.');
        
        // Reset form
        (e.target as HTMLFormElement).reset();
        
        // Redirect to login after short delay
        setTimeout(() => {
          router.push('/pages/auth/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          bgcolor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: `0 4px 12px ${COLORS.primary}30`
            }}
          >
            <PersonAdd sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" fontWeight={700} color={COLORS.text.primary} gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body1" color={COLORS.text.secondary}>
            Join us today and start your journey
          </Typography>
        </Box>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Registration Form */}
        <Box component="form" onSubmit={handleRegister} sx={{ mb: 3 }}>
          <Stack spacing={3}>
            {/* Name Field */}
            <TextField
              name="name"
              type="text"
              placeholder="Enter your full name"
              fullWidth
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: COLORS.text.muted, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  '&:hover': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused': {
                    borderColor: COLORS.primary,
                    boxShadow: `0 0 0 3px ${COLORS.primary}20`,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }}
            />

            {/* Email Field */}
            <TextField
              name="email"
              type="email"
              placeholder="Enter your email"
              fullWidth
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: COLORS.text.muted, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  '&:hover': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused': {
                    borderColor: COLORS.primary,
                    boxShadow: `0 0 0 3px ${COLORS.primary}20`,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }}
            />

            {/* Password Field */}
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              fullWidth
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: COLORS.text.muted, fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: COLORS.text.muted }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  '&:hover': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused': {
                    borderColor: COLORS.primary,
                    boxShadow: `0 0 0 3px ${COLORS.primary}20`,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }}
            />

            {/* Password Requirements */}
            <Typography variant="caption" color={COLORS.text.muted} sx={{ mt: -1 }}>
              Password must be at least 8 characters long
            </Typography>

            {/* Register Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                bgcolor: COLORS.primary,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: `0 4px 12px ${COLORS.primary}30`,
                '&:hover': {
                  bgcolor: COLORS.primaryHover,
                  boxShadow: `0 6px 16px ${COLORS.primary}40`,
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Stack>
        </Box>

        {/* Divider */}
        <Divider sx={{ mb: 3, color: COLORS.text.muted }}>
          <Typography variant="body2" color={COLORS.text.muted}>
            Or sign up with
          </Typography>
        </Divider>

        {/* Social Registration Buttons */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Google Registration Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleSignup}
            disabled={loading}
            startIcon={<GoogleIconSVG />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.primary,
              fontSize: '0.95rem',
              fontWeight: 500,
              textTransform: 'none',
              bgcolor: COLORS.surface,
              '&:hover': {
                bgcolor: COLORS.background,
                borderColor: COLORS.google,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.15)'
              },
              '&:active': {
                transform: 'translateY(0)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Sign up with Google
          </Button>

          {/* GitHub Registration Button */}
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGitHubSignup}
            disabled={loading}
            startIcon={<GitHubIconSVG />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text.primary,
              fontSize: '0.95rem',
              fontWeight: 500,
              textTransform: 'none',
              bgcolor: COLORS.surface,
              '&:hover': {
                bgcolor: COLORS.background,
                borderColor: COLORS.github,
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(36, 41, 46, 0.15)'
              },
              '&:active': {
                transform: 'translateY(0)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Sign up with GitHub
          </Button>
        </Stack>

        {/* Login Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color={COLORS.text.secondary}>
            Already have an account?{' '}
            <Link 
              href="/pages/auth/login" 
              style={{ 
                color: COLORS.primary, 
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterForm;