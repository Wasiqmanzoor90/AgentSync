'use client'
import { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  IconButton,
  Avatar,
  Chip,
  Collapse,
  InputAdornment,
} from '@mui/material';
import {
  Send,
  Chat,
  LightbulbOutlined,
  TrendingUp,
  Psychology,
  Code,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useAuth } from '../../../../hooks/useAuth';
import LoadingData from '../component/loading/isLoading';
import UsageDisplay, { UsageData } from '../../pages/component/chat/UsageDisplay';
import MessageList from '../../pages/component/chat/MessageList';
import { Message } from '../../../../types/message';
import SearchHistoryPanel from '../component/chat/inputData';
import Sidebar from '../component/chat/slidebar';
import VoiceInput from '../component/chat/VoiceAssisatnt';
import Navbar from '../component/chat/Navbar'; // Import the new Navbar component

// Design system constants for consistent theming
const DESIGN_TOKENS = {
  colors: {
    primary: '#6366f1',
    secondary: '#ec4899',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#fafbff',
    surface: '#ffffff',
    border: 'rgba(148, 163, 184, 0.2)',
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    background: 'linear-gradient(180deg, #fafbff 0%, #f1f5ff 100%)',
  },
  spacing: {
    navbar: 72, // Fixed navbar height
    container: 2, // Container padding
    section: 3, // Section spacing
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  }
};

// Quick action buttons configuration
const QUICK_ACTIONS = [
  { icon: <LightbulbOutlined />, label: 'Creative Ideas', color: DESIGN_TOKENS.colors.warning },
  { icon: <Code />, label: 'Code Help', color: DESIGN_TOKENS.colors.success },
  { icon: <Psychology />, label: 'Analysis', color: '#8b5cf6' },
  { icon: <TrendingUp />, label: 'Strategy', color: '#06b6d4' },
];

export default function ChatContainer() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
 

   const [id, setId] = useState<string | null>(null);

  // Load id from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('id');
      if (storedId) setId(storedId);
    }
  }, []);


useEffect(() => {
  if (user?.id) {
    localStorage.setItem('id', user.id);
    setId(user.id);
  }
}, [user]);

  // Core chat state management
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Error and usage state
  const [usageError, setUsageError] = useState<string | null>(null);
  const [currentUsage, setCurrentUsage] = useState<UsageData>({ dailyusage: 0, limit: 5 });

  // UI state
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Handle voice input transcript changes
   * Updates the input field with the transcribed text
   */
  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
  };

  /**
   * Handle navbar menu button click
   * Opens the sidebar for chat history
   */
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Redirect to login if user is not authenticated
   */
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  /**
   * Handle scroll events to show/hide scroll-to-top button
   */
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollTop < scrollHeight - clientHeight - 100;
      setShowScrollToTop(isNearBottom);
    }
  };

  /**
   * Send message to AI and handle the complete flow
   */
  const sendMessage = async () => {
    // Validation checks
    if (!input.trim() || loading || currentUsage.dailyusage >= currentUsage.limit) {
      return;
    }

    setUsageError(null);
    const messageText = input.trim();

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    // Update UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send message to AI API with sessionId for conversation memory
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId: user?.id // Use user ID as session ID for conversation memory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.response) {
        throw new Error('No response from AI');
      }

      // Create AI response message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

console.log("myname iswasiq",id)
      // Save user input to history
      await fetch('/api/agents/inputData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
    body: JSON.stringify({ userId: user?.id, content: messageText }),
      });

      // Update usage counter
      const incrementResponse = await fetch('/api/agents/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!incrementResponse.ok) {
        const errorData = await incrementResponse.json();
        if (incrementResponse.status === 429) {
          setUsageError(errorData.error || 'Rate limit exceeded');
        }
      } else {
        setCurrentUsage(prev => ({ ...prev, dailyusage: prev.dailyusage + 1 }));
      }

    } catch (error) {
      console.error('Error sending message:', error);

      // Show error message to user
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Something went wrong. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Enter key press for sending messages
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Delete a specific message
   */
  const deleteMessage = async (messageId: string) => {
    setDeleteLoading(messageId);

    try {
      const response = await fetch(`/api/agents/inputDelete/${messageId}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.status}`);
      }

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setUsageError(null);
    } catch (error) {
      console.error("Delete message error:", error);
      setUsageError("Failed to delete message. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  /**
   * Scroll to top of messages
   */
  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle quick action button clicks
   */
  const handleQuickAction = (label: string) => {
    setInput(`Help me with ${label.toLowerCase()}`);
  };

  // Show loading screen while authenticating
  if (isLoading || !user) {
    return <LoadingData />;
  }

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      background: DESIGN_TOKENS.gradients.background,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden'
    }}>
      {/* Sidebar for chat history */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Chat History"
        loading={loading}
      >
        <SearchHistoryPanel userId={user.id} />
      </Sidebar>

      {/* Main chat container */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
      }}>
        {/* Navigation bar component */}
        <Navbar
          onMenuClick={handleMenuClick}
          userId={user.id}
          onUsageUpdate={setCurrentUsage}
          title="AI Voice Assistant"
          subtitle="Speak or type your message"
        />

        {/* Mobile usage display - shown below navbar on small screens */}
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          px: DESIGN_TOKENS.spacing.container,
          py: 1,
          borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`,
          background: DESIGN_TOKENS.colors.surface,
        }}>
          <UsageDisplay userId={user.id} onUsageUpdate={setCurrentUsage} />
        </Box>

        {/* Error alert section */}
        <Box sx={{ px: DESIGN_TOKENS.spacing.container, pt: 1 }}>
          <Collapse in={!!usageError}>
            {usageError && (
              <Alert
                severity="error"
                variant="filled"
                onClose={() => setUsageError(null)}
                sx={{
                  borderRadius: DESIGN_TOKENS.borderRadius.sm,
                  mb: 1,
                }}
              >
                {usageError}
              </Alert>
            )}
          </Collapse>
        </Box>

        {/* Messages area with proper margins */}
        <Box
          ref={messagesContainerRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: DESIGN_TOKENS.spacing.container,
            py: 1,
            minHeight: 0,
          }}
        >
          {messages.length === 0 ? (
            // Welcome screen
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              py: 6,
              maxWidth: 600,
              mx: 'auto',
            }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: DESIGN_TOKENS.gradients.primary,
                  mb: 3,
                  boxShadow: DESIGN_TOKENS.shadows.lg,
                }}
              >
                <Chat sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography
                variant="h3"
                fontWeight={700}
                color={DESIGN_TOKENS.colors.text.primary}
                gutterBottom
                sx={{ fontSize: '2rem', mb: 2 }}
              >
                Voice-Enabled AI Assistant
              </Typography>

              <Typography
                variant="body1"
                color={DESIGN_TOKENS.colors.text.secondary}
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Start a conversation by speaking or typing. I can help with creative ideas,
                code problems, analysis, and strategic planning.
              </Typography>

              {/* Quick action buttons */}
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                justifyContent="center"
                sx={{ gap: 1.5 }}
              >
                {QUICK_ACTIONS.map((action) => (
                  <Chip
                    key={action.label}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    sx={{
                      height: 40,
                      px: 2,
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      background: `${action.color}15`,
                      color: action.color,
                      border: `1px solid ${action.color}30`,
                      borderRadius: DESIGN_TOKENS.borderRadius.md,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: action.color,
                        color: 'white',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ) : (
            // Messages list
            <MessageList
              messages={messages}
              loading={loading}
              bottomRef={messagesEndRef as RefObject<HTMLDivElement>}
              onDeleteMessage={deleteMessage}
              deleteLoading={deleteLoading}
            />
          )}
        </Box>

        {/* Input area with proper spacing */}
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: `1px solid ${DESIGN_TOKENS.colors.border}`,
            px: DESIGN_TOKENS.spacing.container,
            py: 2,
            boxShadow: DESIGN_TOKENS.shadows.md,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message or use voice input..."
              disabled={loading || currentUsage.dailyusage >= currentUsage.limit}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 1 }}>
                    <VoiceInput
                      onTranscriptChange={handleVoiceTranscript}
                      disabled={loading || currentUsage.dailyusage >= currentUsage.limit}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: DESIGN_TOKENS.borderRadius.md,
                  background: DESIGN_TOKENS.colors.surface,
                  '&:hover fieldset': {
                    borderColor: DESIGN_TOKENS.colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: DESIGN_TOKENS.colors.primary,
                    borderWidth: 2,
                  },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!input.trim() || loading || currentUsage.dailyusage >= currentUsage.limit}
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                background: DESIGN_TOKENS.gradients.primary,
                boxShadow: DESIGN_TOKENS.shadows.md,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: DESIGN_TOKENS.shadows.lg,
                },
              }}
            >
              <Send fontSize="small" />
            </Button>
          </Stack>
        </Paper>

        {/* Scroll to top button */}
        {showScrollToTop && (
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              right: 24,
              bottom: 120,
              background: DESIGN_TOKENS.gradients.primary,
              color: 'white',
              width: 48,
              height: 48,
              boxShadow: DESIGN_TOKENS.shadows.lg,
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            <KeyboardArrowUp />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}