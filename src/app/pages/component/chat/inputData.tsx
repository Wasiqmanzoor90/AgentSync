// components/SearchHistoryPanel.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Fade,
  Collapse,
  Stack,
  Divider,
  InputBase,
  Tooltip
} from '@mui/material';
import { 
  MoreVert, 
  Delete, 
  History,
  Search,
  AccessTime,
  Clear,
  FilterList,
  ChatBubbleOutline
} from '@mui/icons-material';

// Enhanced color palette matching the chat interface
const COLORS = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  secondary: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    secondary: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    surface: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  
  background: '#fafbff',
  surface: '#ffffff',
  surfaceVariant: '#f8fafc',
  
  border: 'rgba(148, 163, 184, 0.2)',
  borderLight: 'rgba(148, 163, 184, 0.1)',
  borderFocus: 'rgba(99, 102, 241, 0.3)',
  
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#94a3b8',
    inverse: '#ffffff'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  }
};

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

interface Props {
  userId?: string; // Made optional since we're getting it from localStorage
}

export default function SearchHistoryPanel({ }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdLoaded, setUserIdLoaded] = useState(false); // Add loading state

  // Load userId from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem('id');
    console.log("StoredId from localStorage:", storedId);
    if (storedId) {
      setUserId(storedId);
    }
    setUserIdLoaded(true); // Mark as loaded regardless of whether we found an ID
  }, []);

  // Fetch messages when userId is available
  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (!userId) {
        console.log("No userId available, skipping fetch");
        return;
      }

      console.log("Fetching messages for userId:", userId);
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/agents/inputData?id=${userId}`);
        console.log("Fetch response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch messages: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Fetched data:", data);
        
        const messageData = data.data || [];
        console.log("Message data:", messageData);
        
        setMessages(messageData);
        setFilteredMessages(messageData);
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when we have loaded the userId and it exists
    if (userIdLoaded && userId) {
      fetchSearchHistory();
    } else if (userIdLoaded && !userId) {
      // User ID has been loaded but is null/undefined
      console.log("No valid userId found in localStorage");
      setError("No user ID found. Please log in again.");
    }
  }, [userId, userIdLoaded]); // Include userIdLoaded in dependencies

  // Filter messages based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(msg =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, messages]);

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, message: Message) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    setDeleteLoading(messageId);
    try {
      const res = await fetch(`/api/agents/inputDelete/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`Failed to delete message: ${res.status}`);
      }

      // Remove from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setError(null);
    } catch (error: any) {
      setError('Failed to delete message');
    } finally {
      setDeleteLoading(null);
      handleMenuClose();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  // Truncate message content
  const truncateMessage = (content: string, maxLength: number = 60) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: COLORS.gradients.surface,
      borderRadius: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${COLORS.borderLight}`,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: COLORS.gradients.primary,
                boxShadow: COLORS.shadows.glow
              }}
            >
              <History sx={{ fontSize: 18 }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color={COLORS.text.primary}
                sx={{ fontSize: '1.1rem', letterSpacing: '-0.01em' }}
              >
                Chat History
              </Typography>
              <Typography 
                variant="caption" 
                color={COLORS.text.muted}
                sx={{ fontSize: '0.75rem' }}
              >
                {messages.length} conversations
              </Typography>
            </Box>
          </Stack>
          
          <Tooltip title="Search history" arrow>
            <IconButton
              onClick={() => setShowSearch(!showSearch)}
              sx={{
                background: showSearch ? COLORS.gradients.primary : 'rgba(99, 102, 241, 0.1)',
                color: showSearch ? 'white' : COLORS.primary,
                width: 36,
                height: 36,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: COLORS.gradients.primary,
                  color: 'white',
                  transform: 'translateY(-1px)',
                  boxShadow: COLORS.shadows.md
                }
              }}
            >
              <Search fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Search Bar */}
        <Collapse in={showSearch}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 3,
              px: 2,
              py: 1,
              transition: 'all 0.3s ease',
              '&:focus-within': {
                borderColor: COLORS.primary,
                boxShadow: `0 0 0 3px ${COLORS.borderFocus}`
              }
            }}
          >
            <Search sx={{ color: COLORS.text.muted, mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: '0.9rem',
                color: COLORS.text.primary,
                '& input::placeholder': {
                  color: COLORS.text.muted,
                  opacity: 1
                }
              }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                onClick={clearSearch}
                sx={{ 
                  color: COLORS.text.muted,
                  '&:hover': { color: COLORS.error }
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            )}
          </Paper>
        </Collapse>

        {/* Search Results Info */}
        {searchQuery && (
          <Fade in>
            <Box sx={{ mt: 2 }}>
              <Chip
                size="small"
                label={`${filteredMessages.length} results`}
                sx={{
                  background: `${COLORS.primary}15`,
                  color: COLORS.primary,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Fade>
        )}
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            p: 4,
            gap: 2
          }}>
            <CircularProgress 
              size={32} 
              sx={{ color: COLORS.primary }}
            />
            <Typography variant="body2" color={COLORS.text.muted}>
              Loading your conversations...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ p: 3 }}>
            <Alert 
              severity="error" 
              variant="outlined"
              sx={{ 
                borderRadius: 3,
                background: `${COLORS.error}08`,
                borderColor: `${COLORS.error}30`,
                '& .MuiAlert-icon': { color: COLORS.error }
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredMessages.length === 0 && !error && (
          <Box sx={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            p: 4,
            textAlign: 'center'
          }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: `${COLORS.primary}15`,
                color: COLORS.primary,
                mb: 2
              }}
            >
              <ChatBubbleOutline sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography 
              variant="h6" 
              color={COLORS.text.primary}
              fontWeight={600}
              gutterBottom
            >
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </Typography>
            <Typography 
              variant="body2" 
              color={COLORS.text.muted}
              sx={{ maxWidth: 200, lineHeight: 1.5 }}
            >
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start chatting to see your conversation history here'
              }
            </Typography>
          </Box>
        )}

        {/* Messages List */}
        {!loading && filteredMessages.length > 0 && (
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <List sx={{ p: 0 }}>
              {filteredMessages.map((msg, index) => (
                <React.Fragment key={msg.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'rgba(99, 102, 241, 0.05)',
                        transform: 'translateX(4px)',
                        '& .action-button': {
                          opacity: 1,
                          transform: 'translateX(0)'
                        }
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ width: '100%', alignItems: 'flex-start' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: `${COLORS.primary}15`,
                          color: COLORS.primary,
                          mt: 0.5
                        }}
                      >
                        <AccessTime sx={{ fontSize: 16 }} />
                      </Avatar>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          color={COLORS.text.primary}
                          sx={{
                            fontWeight: 500,
                            lineHeight: 1.4,
                            mb: 0.5,
                            wordBreak: 'break-word'
                          }}
                        >
                          {truncateMessage(msg.content)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={COLORS.text.muted}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {formatRelativeTime(msg.createdAt)}
                        </Typography>
                      </Box>

                      <IconButton
                        className="action-button"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, msg)}
                        disabled={deleteLoading === msg.id}
                        sx={{
                          opacity: 0,
                          transform: 'translateX(8px)',
                          transition: 'all 0.2s ease',
                          color: COLORS.text.muted,
                          '&:hover': {
                            color: COLORS.text.primary,
                            background: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        {deleteLoading === msg.id ? (
                          <CircularProgress size={16} sx={{ color: COLORS.primary }} />
                        ) : (
                          <MoreVert fontSize="small" />
                        )}
                      </IconButton>
                    </Stack>
                  </ListItem>
                  
                  {index < filteredMessages.length - 1 && (
                    <Divider sx={{ mx: 3, borderColor: COLORS.borderLight }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* Delete Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 120,
            boxShadow: COLORS.shadows.lg,
            border: `1px solid ${COLORS.borderLight}`
          }
        }}
      >
        <MenuItem
          onClick={() => selectedMessage && deleteMessage(selectedMessage.id)}
          sx={{ 
            color: COLORS.error,
            py: 1.5,
            '&:hover': {
              background: `${COLORS.error}10`
            }
          }}
        >
          <Delete sx={{ mr: 1.5, fontSize: 18 }} />
          <Typography variant="body2" fontWeight={500}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}