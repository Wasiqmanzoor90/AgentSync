import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu,
  AutoAwesome,
} from '@mui/icons-material';
import { UsageData } from '../../component/chat/UsageDisplay';
import UsageDisplay from '../../component/chat/UsageDisplay';

// Design tokens for consistent styling
const NAVBAR_TOKENS = {
  height: 72,
  colors: {
    primary: '#6366f1',
    background: 'rgba(255, 255, 255, 0.98)',
    border: 'rgba(148, 163, 184, 0.2)',
    text: {
      primary: '#0f172a',
      muted: '#94a3b8',
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
  borderRadius: 8,
  spacing: 2,
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  }
};

interface NavbarProps {
  /** Handler for opening the sidebar */
  onMenuClick: () => void;
  /** Current user ID for usage display */
  userId: string;
  /** Callback when usage data is updated */
  onUsageUpdate: (usage: UsageData) => void;
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  subtitle?: string;
}

/**
 * Navbar component for the chat interface
 * Displays app title, menu button, and usage information
 */
const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  userId,
  onUsageUpdate,
  title = "AI Voice Assistant",
  subtitle = "Speak or type your message"
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: NAVBAR_TOKENS.colors.background,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${NAVBAR_TOKENS.colors.border}`,
        boxShadow: NAVBAR_TOKENS.shadows.sm,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: NAVBAR_TOKENS.height,
      }}
    >
      <Box sx={{
        px: NAVBAR_TOKENS.spacing,
        py: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      }}>
        {/* Left section - Menu button and app info */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Menu button */}
          <Tooltip title="Open chat history" arrow>
            <IconButton
              onClick={onMenuClick}
              sx={{
                background: `${NAVBAR_TOKENS.colors.primary}15`,
                border: `1px solid ${NAVBAR_TOKENS.colors.primary}30`,
                borderRadius: NAVBAR_TOKENS.borderRadius,
                width: 40,
                height: 40,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: NAVBAR_TOKENS.colors.primary,
                  color: 'white',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              <Menu fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* App branding section */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {/* App icon */}
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: NAVBAR_TOKENS.gradients.primary,
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              
              }}
            >
              <AutoAwesome sx={{ fontSize: 18, color: 'white' }} />
            </Avatar>

            {/* App title and subtitle */}
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color={NAVBAR_TOKENS.colors.text.primary}
                sx={{ 
                  fontSize: '1.1rem', 
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em'
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                color={NAVBAR_TOKENS.colors.text.muted}
                sx={{ 
                  fontSize: '0.8rem',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Right section - Usage display */}
    <Box sx={{ 
  display: { xs: 'none', md: 'flex' },
  alignItems: 'center'
}}>

          <UsageDisplay 
            userId={userId} 
            onUsageUpdate={onUsageUpdate} 
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Navbar;