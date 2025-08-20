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
import { Menu, AutoAwesome } from '@mui/icons-material';
import UsageDisplay, { UsageData } from '../../component/chat/UsageDisplay';

// Design tokens for styling consistency
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
  onMenuClick: () => void;
  userId: string;
  onUsageUpdate: (usage: UsageData) => void;
  title?: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  userId,
  onUsageUpdate,
  title = "Agent-Sync",
  subtitle = "Speak or type your message"
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: NAVBAR_TOKENS.height,
        bgcolor: NAVBAR_TOKENS.colors.background,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${NAVBAR_TOKENS.colors.border}`,
        boxShadow: NAVBAR_TOKENS.shadows.sm,
      }}
    >
      <Box
        sx={{
          px: NAVBAR_TOKENS.spacing,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* LEFT SECTION: Menu Button + Branding */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Menu Button */}
          <Tooltip title="Open chat history" arrow>
            <IconButton
              onClick={onMenuClick}
              sx={{
                width: 40,
                height: 40,
                borderRadius: NAVBAR_TOKENS.borderRadius,
                background: `${NAVBAR_TOKENS.colors.primary}15`,
                border: `1px solid ${NAVBAR_TOKENS.colors.primary}30`,
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

          {/* App Icon and Title */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {/* Icon */}
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

            {/* Title and Subtitle */}
            <Box>
              <Typography
                fontWeight={600}
                fontSize="1.1rem"
                color={NAVBAR_TOKENS.colors.text.primary}
                sx={{
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em'
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: NAVBAR_TOKENS.colors.text.muted,
                  fontSize: '0.8rem',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {subtitle}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Box
  sx={{
    display: {
      xs: 'none', // hidden on extra-small (mobile)
      sm: 'flex', // visible on small screens and up
    },
    alignItems: 'center',
    height: '100%',
    pl: 2,
  }}
>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    }}
  >
    <UsageDisplay
      userId={userId}
      onUsageUpdate={onUsageUpdate}
    />
  </Box>
</Box>

      </Box>
    </Paper>
  );
};

export default Navbar;
