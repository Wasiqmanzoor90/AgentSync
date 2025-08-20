// components/Sidebar.tsx
'use client';
import React from 'react';


import {
  Drawer,
  Box,
  Typography,
  Stack,
  IconButton,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  History as HistoryIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number;
  children: React.ReactNode;
  onClearAll?: () => void;
  clearButtonText?: string;
  clearButtonIcon?: React.ReactNode;
  loading?: boolean;
}


export default function Sidebar({
  open,
  onClose,
  title = "Sidebar",
  width = 320,
  children,
  onClearAll,

}: SidebarProps) {
  const theme = useTheme();
const router = useRouter();



const handleLogout = async () => {
  // Delete with matching attributes
  document.cookie = "token=; path=/; max-age=0";
  localStorage.clear();
  window.location.href = '/';
};

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          boxShadow: theme.shadows[8],
        },
      }}
    >
      
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}` 
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          </Stack>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.08) }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>
      
      {/* Clear All Button */}
      {onClearAll && (
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` 
        }}>
          
        </Box>
      )}
      
      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {children}
      </Box>

        <Box  width="100%">
  <Button
    fullWidth
    style={{
      backgroundColor: "#6366f1",
      color: "white",
      padding: "8px",
    }}
    onClick={handleLogout}
  >
    Logout
  </Button>
</Box>

    </Drawer>
  );
}