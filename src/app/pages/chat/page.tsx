'use client';
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
  Fade,
  Avatar,
  Chip,
  Tooltip,
  Zoom,
  Collapse,

} from '@mui/material';
import {
  Send,
 
  Menu as MenuIcon,
  ChatBubbleOutline,
  AutoAwesome,
  Lightbulb,
  TrendingUp,
  Psychology,
  Code,
  KeyboardArrowUp,
  Mic,
  Stop
} from '@mui/icons-material';
import { useAuth } from '../../../../hooks/useAuth';
import LoadingData from '../component/loading/isLoading';
import UsageDisplay, { UsageData } from '../../pages/component/chat/UsageDisplay';
import MessageList from '../../pages/component/chat/MessageList';
import { Message } from '../../../../types/message';
import SearchHistoryPanel from '../component/chat/inputData';
import Sidebar from '../component/chat/slidebar';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


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
    chat: 'linear-gradient(180deg, #fafbff 0%, #f1f5ff 100%)',
  },
  background: '#fafbff',
  surface: '#ffffff',
  surfaceVariant: '#f8fafc',
  surfaceElevated: '#ffffff',
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
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  }
};

const QUICK_ACTIONS = [
  { icon: <Lightbulb />, label: 'Creative Ideas', color: '#f59e0b' },
  { icon: <Code />, label: 'Code Help', color: '#10b981' },
  { icon: <Psychology />, label: 'Analysis', color: '#8b5cf6' },
  { icon: <TrendingUp />, label: 'Strategy', color: '#06b6d4' },
];

export default function ChatContainer() {
  const router = useRouter();

  const { user, isLoading } = useAuth();


  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [currentUsage, setCurrentUsage] = useState<UsageData>({ dailyusage: 0, limit: 5 });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Voice state
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening
    
  } = useSpeechRecognition();
  const [isVoiceInput, setIsVoiceInput] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Handle voice input changes
  useEffect(() => {
    if (isVoiceInput) {
      setInput(transcript);
    }
  }, [transcript, isVoiceInput]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) router.replace('/');
  }, [isLoading, user, router]);

  // Handle scroll events
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollToTop(scrollTop < scrollHeight - clientHeight - 100);
    }
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!input.trim() || loading || currentUsage.dailyusage >= currentUsage.limit) return;

    setIsVoiceInput(false);
    resetTranscript();
    setUsageError(null);
    const messageText = input.trim();

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
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.response) throw new Error('No response from AI');

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      await fetch('/api/agents/inputData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content: messageText }),
      });

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteMessage = async (messageId: string) => {
    setDeleteLoading(messageId);
    try {
      const res = await fetch(`/api/agents/inputDelete/${messageId}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error(`Failed to delete message: ${res.status}`);

      setMessages((prev) => prev.filter(msg => msg.id !== messageId));
      setUsageError(null);
    } catch (error) {
      console.error("Delete message error:", error);
      setUsageError("Failed to delete message. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAction = (label: string) => {
    setInput(`Help me with ${label.toLowerCase()}`);
  };

  // Voice control functions
  const startVoiceInput = () => {
    setIsVoiceInput(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true }); //  Works!
  };

  const stopVoiceInput = () => {
    setIsVoiceInput(false);
   SpeechRecognition.stopListening(); // ✅ Correct usage
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading || !user) return <LoadingData />;

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      background: COLORS.gradients.chat,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden'
    }}>
    

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title="Chat History"
        loading={loading}
      >
        <SearchHistoryPanel userId={user.id} />
      </Sidebar>

      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxHeight: '100vh'
        }}>
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${COLORS.borderLight}`,
              boxShadow: COLORS.shadows.sm,
              width: '100%',
              position: 'fixed',
              top: 0,
            
              right: 0,
              zIndex: 1000,
              transition: 'left 0.3s ease'
            }}
          >
            <Box sx={{
              p: { xs: 1.5, md: 2 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              minHeight: 60
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Tooltip title="Open chat history" arrow>
                  <IconButton
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: `1px solid ${COLORS.borderFocus}`,
                      borderRadius: 2,
                      width: 36,
                      height: 36,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: COLORS.gradients.primary,
                        color: 'white',
                        transform: 'translateY(-1px)',
                        boxShadow: COLORS.shadows.md
                      }
                    }}
                  >
                    <MenuIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      background: COLORS.gradients.primary,
                      boxShadow: COLORS.shadows.glow,
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 16 }} />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={COLORS.text.primary}
                      sx={{
                        fontSize: '1rem',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2
                      }}
                    >
                      AI Voice Assistant
                    </Typography>
                    <Typography
                      variant="caption"
                      color={COLORS.text.muted}
                      sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.75rem' }}
                    >
                      Speak or type your message
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <UsageDisplay userId={user.id} onUsageUpdate={setCurrentUsage} />
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {/* <Circle sx={{ fontSize: 6, color: COLORS.success }} /> */}
                </Stack>
              </Stack>
            </Box>
          </Paper>

          <Box sx={{
            display: { xs: 'block', md: 'none' },
            pt: '76px',
            px: 2,
            pb: 1
          }}>
            <UsageDisplay userId={user.id} onUsageUpdate={setCurrentUsage} />
          </Box>

          <Box sx={{ px: 2, pt: { xs: 1, md: '76px' }, width: '100%' }}>
            <Collapse in={!!usageError}>
              {usageError && (
                <Alert
                  severity="error"
                  variant="filled"
                  onClose={() => setUsageError(null)}
                  sx={{
                    borderRadius: 2,
                    boxShadow: COLORS.shadows.md,
                    mb: 1,
                    '& .MuiAlert-message': {
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }
                  }}
                >
                  {usageError}
                </Alert>
              )}
            </Collapse>
          </Box>

          <Box
            ref={messagesContainerRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              px: 2,
              pb: 1,
              pt: { xs: 0, md: 1 },
              minHeight: 0
            }}
          >
            {messages.length === 0 ? (
              <Box sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                p: { xs: 2, md: 4 },
                maxWidth: 500,
                mx: 'auto'
              }}>
                <Zoom in timeout={800}>
                  <Avatar
                    sx={{
                      width: { xs: 60, md: 80 },
                      height: { xs: 60, md: 80 },
                      background: COLORS.gradients.primary,
                      mb: 3,
                      boxShadow: COLORS.shadows.xl,
                      border: '3px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <ChatBubbleOutline sx={{ fontSize: { xs: 30, md: 40 } }} />
                  </Avatar>
                </Zoom>

                <Fade in timeout={1200}>
                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      color={COLORS.text.primary}
                      gutterBottom
                      sx={{
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        letterSpacing: '-0.02em',
                        mb: 1.5
                      }}
                    >
                      Voice-Enabled AI Assistant
                    </Typography>
                    <Typography
                      variant="h6"
                      color={COLORS.text.secondary}
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.5,
                        mb: 3,
                        fontWeight: 400
                      }}
                    >
                      Speak naturally or type your questions. I can help with ideas, code, analysis, and more.
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={2}
                      flexWrap="wrap"
                      justifyContent="center"
                      sx={{ gap: 2 }}
                    >
                      {QUICK_ACTIONS.map((action, index) => (
                        <Zoom in timeout={1400 + index * 200} key={action.label}>
                          <Chip
                            icon={action.icon}
                            label={action.label}
                            onClick={() => handleQuickAction(action.label)}
                            sx={{
                              height: 40,
                              px: 1.5,
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: `${action.color}15`,
                              color: action.color,
                              border: `1px solid ${action.color}30`,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: action.color,
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px ${action.color}40`
                              },
                              '& .MuiChip-icon': {
                                fontSize: 16,
                                color: 'inherit'
                              }
                            }}
                          />
                        </Zoom>
                      ))}
                    </Stack>
                  </Box>
                </Fade>
              </Box>
            ) : (
              <MessageList
                messages={messages}
                loading={loading}
                bottomRef={messagesEndRef as RefObject<HTMLDivElement>}
                onDeleteMessage={deleteMessage}
                deleteLoading={deleteLoading}
                // onSpeak={speak}
              />
            )}
          </Box>

          <Zoom in={showScrollToTop}>
            <IconButton
              onClick={scrollToTop}
              sx={{
                position: 'fixed',
                right: 20,
                bottom: 100,
                zIndex: 10,
                background: COLORS.gradients.primary,
                color: 'white',
                width: 44,
                height: 44,
                boxShadow: COLORS.shadows.lg,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: COLORS.shadows.xl
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <KeyboardArrowUp />
            </IconButton>
          </Zoom>

          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderTop: `1px solid ${COLORS.borderLight}`,
              width: '100%',
              p: 2
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <TextField
                fullWidth
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setIsVoiceInput(false);
                }}
                onKeyPress={handleKeyPress}
                disabled={loading || listening}
                placeholder={listening ? "Listening... Speak now" : "Type or speak your message..."}
                multiline
                maxRows={4}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'white',
                    border: `1px solid ${listening ? COLORS.primary : COLORS.border}`,
                    fontSize: '0.95rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: COLORS.primaryLight,
                      boxShadow: `0 2px 8px rgba(99, 102, 241, 0.1)`
                    },
                    '&.Mui-focused': {
                      borderColor: COLORS.primary,
                      boxShadow: `0 0 0 3px ${COLORS.borderFocus}`,
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    py: 2,
                    px: 2.5,
                    fontSize: '0.95rem',
                    color: COLORS.text.primary,
                    lineHeight: 1.4,
                    '&::placeholder': {
                      color: listening ? COLORS.primary : COLORS.text.muted,
                      opacity: 1,
                      fontWeight: listening ? 600 : 400
                    }
                  }
                }}
              />

              {browserSupportsSpeechRecognition && (
                <Tooltip title={listening ? "Stop recording" : "Start voice input"}>
                  <Button
                    variant={listening ? "contained" : "outlined"}
                    color={listening ? "error" : "primary"}
                    onClick={listening ? stopVoiceInput : startVoiceInput}
                    disabled={loading}
                    sx={{
                      minWidth: 48,
                      height: 48,
                      borderRadius: 3,
                      border: listening ? 'none' : undefined,
                      background: listening 
                        ? COLORS.error 
                        : 'rgba(99, 102, 241, 0.1)',
                      '&:hover': {
                        background: listening 
                          ? COLORS.error 
                          : 'rgba(99, 102, 241, 0.2)'
                      }
                    }}
                  >
                    {listening ? <Stop fontSize="small" /> : <Mic fontSize="small" />}
                  </Button>
                </Tooltip>
              )}

              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={loading || !input.trim() || currentUsage.dailyusage >= currentUsage.limit}
                sx={{
                  minWidth: 48,
                  height: 48,
                  borderRadius: 3,
                  background: COLORS.gradients.primary,
                  boxShadow: COLORS.shadows.md,
                  paddingRight: '40px',
                  border: 'none',
                  display: 'flex',
                  flexWrap: 'wrap',
                  overflowX: 'hidden',
                  maxWidth: '100%',
                  '&:hover': {
                    background: COLORS.gradients.primary,
                    transform: 'translateY(-1px)',
                    boxShadow: COLORS.shadows.lg
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  },
                  '&:disabled': {
                    background: COLORS.text.muted,
                    color: 'white',
                    opacity: 0.6,
                    transform: 'none'
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Send sx={{ fontSize: 20 }} />
              </Button>
            </Stack>

            <Fade in={!loading && input.length === 0}>
              <Typography
                variant="caption"
                color={COLORS.text.muted}
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  fontSize: '0.75rem'
                }}
              >
                {browserSupportsSpeechRecognition 
                  ? 'Press mic to speak or type your message • Enter to send' 
                  : 'Type your message • Enter to send'}
              </Typography>
            </Fade>

            {!browserSupportsSpeechRecognition && (
              <Typography
                variant="caption"
                color={COLORS.warning}
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  fontSize: '0.75rem'
                }}
              >
                Voice input not supported in this browser (try Chrome, Edge, or Firefox)
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}