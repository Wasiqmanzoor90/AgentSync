'use client';
import { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Stack, 
  Alert, 
  IconButton, 
  Fade,
  useTheme
} from '@mui/material';
import { 
  Send, 
  DeleteSweep, 
  Menu as MenuIcon,
  ChatBubbleOutline,
  AutoAwesome
} from '@mui/icons-material';
import { useAuth } from '../../../../hooks/useAuth';
import LoadingData from '../component/loading/isLoading';
import UsageDisplay, { UsageData } from '../../pages/component/chat/UsageDisplay';
import MessageList from '../../pages/component/chat/MessageList';
import { Message } from '../../../../types/message';
import SearchHistoryPanel from '../component/chat/inputData';
import Sidebar from '../component/chat/slidebar';

// Color palette constants for consistent theming
const COLORS = {
  primary: '#2563eb', // Blue
  primaryLight: '#3b82f6',
  primaryDark: '#1d4ed8',
  secondary: '#6366f1', // Indigo
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  error: '#ef4444', // Red
  background: '#f8fafc', // Light gray
  surface: '#ffffff',
  surfaceVariant: '#f1f5f9',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    muted: '#94a3b8'
  },
  shadow: 'rgba(0, 0, 0, 0.1)'
};

export default function ChatContainer() {
  const router = useRouter();
  const theme = useTheme();
  const { user, isLoading } = useAuth();
  
  // Chat state management
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [currentUsage, setCurrentUsage] = useState<UsageData>({ dailyusage: 0, limit: 5 });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) router.replace('/');
  }, [isLoading, user, router]);

  // Show loading screen while authenticating
  if (isLoading || !user) return <LoadingData />;

  // Handle sending messages to AI
  const sendMessage = async () => {
    // Validation checks
    if (!input.trim() || loading || currentUsage.dailyusage >= currentUsage.limit) return;

    setUsageError(null);
    const messageText = input.trim();

    // Create and add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Step 1: Send message to AI API
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.response) throw new Error('No response from AI');

      // Create and add AI response message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Step 2: Save user message to database
      await fetch('/api/agents/inputData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content: messageText }),
      });

      // Step 3: Update usage counter
      const incrementRes = await fetch('/api/agents/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!incrementRes.ok) {
        const errorData = await incrementRes.json();
        if (incrementRes.status === 429) {
          setUsageError(errorData.error || 'Rate limit exceeded');
        }
      } else {
        setCurrentUsage((prev) => ({ ...prev, dailyusage: prev.dailyusage + 1 }));
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errMsg: Message = {
        id: `error-${Date.now()}`,
        text: 'Something went wrong. Try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Delete individual message
  const deleteMessage = async (messageId: string) => {
    setDeleteLoading(messageId);
    try {
      const res = await fetch(`/api/agents/inputDelete/${messageId}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error(`Failed to delete message: ${res.status}`);

      // Remove message from UI
      setMessages((prev) => prev.filter(msg => msg.id !== messageId));
      setUsageError(null);
    } catch (error) {
      console.error("Delete message error:", error);
      setUsageError("Failed to delete message. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      bgcolor: COLORS.background,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Sidebar for search history */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Search History"
        width={320}
     
        loading={loading}
      >
        <SearchHistoryPanel userId={user.id} />
      </Sidebar>

      {/* Main chat interface */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg" sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          py: 0,
          px: { xs: 1, sm: 2 }
        }}>
          {/* Header section with title and controls */}
          <Paper 
            elevation={0} 
            sx={{ 
              bgcolor: COLORS.surface,
              borderBottom: `1px solid ${COLORS.borderLight}`,
              backdropFilter: 'blur(20px)',
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              borderRadius: 0
            }}
          >
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              {/* Left section: Menu button and title */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={() => setSidebarOpen(true)}
                  sx={{ 
                    color: COLORS.text.secondary,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 2,
                    width: 40,
                    height: 40,
                    '&:hover': { 
                      bgcolor: COLORS.primaryLight + '10',
                      borderColor: COLORS.primaryLight,
                      color: COLORS.primary
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
                
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: COLORS.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${COLORS.primary}30`
                    }}
                  >
                    <AutoAwesome sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color={COLORS.text.primary}
                    sx={{ fontSize: '1.1rem' }}
                  >
                    AI Assistant
                  </Typography>
                </Stack>
              </Stack>
            
            </Box>

            {/* Usage display component */}
            <UsageDisplay userId={user.id} onUsageUpdate={setCurrentUsage} />
          </Paper>

          {/* Error message display */}
          <Fade in={!!usageError}>
            <Box sx={{ p: 2 }}>
              {usageError && (
                <Alert 
                  severity="error" 
                  variant="outlined"
                  sx={{ 
                    borderRadius: 3,
                    bgcolor: COLORS.error + '08',
                    borderColor: COLORS.error + '30',
                    color: COLORS.error,
                    '& .MuiAlert-icon': {
                      color: COLORS.error
                    }
                  }}
                >
                  {usageError}
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Messages display area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative'
          }}>
            {messages.length === 0 ? (
              // Empty state when no messages
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                p: 4
              }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: COLORS.primary + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    border: `2px solid ${COLORS.primary}20`
                  }}
                >
                  <ChatBubbleOutline sx={{ fontSize: 40, color: COLORS.primary }} />
                </Box>
                <Typography 
                  variant="h5" 
                  fontWeight={600} 
                  color={COLORS.text.primary} 
                  gutterBottom
                  sx={{ fontSize: '1.5rem' }}
                >
                  Welcome to AI Assistant
                </Typography>
                <Typography 
                  variant="body1" 
                  color={COLORS.text.secondary} 
                  sx={{ maxWidth: 400, lineHeight: 1.6 }}
                >
                  Start a conversation by typing your message below. I'm here to help with any questions you might have.
                </Typography>
              </Box>
            ) : (
              // Messages list when chat has content
              <MessageList
                messages={messages}
                loading={loading}
                bottomRef={messagesEndRef as RefObject<HTMLDivElement>}
                onDeleteMessage={deleteMessage}
                deleteLoading={deleteLoading}
              />
            )}
          </Box>

          {/* Message input area */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              bgcolor: COLORS.surface,
              borderTop: `1px solid ${COLORS.borderLight}`,
              backdropFilter: 'blur(20px)',
              borderRadius: 0
            }}
          >
            <Box sx={{ maxWidth: 768, mx: 'auto' }}>
              <Stack direction="row" spacing={2} alignItems="flex-end">
                {/* Message input field */}
                <TextField
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  placeholder="Type your message..."
                  multiline
                  maxRows={4}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: COLORS.primaryLight,
                        boxShadow: `0 0 0 3px ${COLORS.primary}10`
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
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.5,
                      fontSize: '0.95rem',
                      color: COLORS.text.primary,
                      '&::placeholder': {
                        color: COLORS.text.muted,
                        opacity: 1
                      }
                    }
                  }}
                />
                
                {/* Send button */}
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={loading || !input.trim() || currentUsage.dailyusage >= currentUsage.limit}
                  sx={{ 
                    minWidth: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: COLORS.primary,
                    boxShadow: `0 4px 12px ${COLORS.primary}30`,
                    border: `1px solid ${COLORS.primary}`,
                    '&:hover': {
                      bgcolor: COLORS.primaryDark,
                      boxShadow: `0 6px 16px ${COLORS.primary}40`,
                      transform: 'translateY(-1px)'
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    },
                    '&:disabled': {
                      bgcolor: COLORS.text.muted,
                      color: 'white',
                      opacity: 0.6
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Send fontSize="small" />
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}