'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Stack,
} from '@mui/material';
import { Send, Person, SmartToy } from '@mui/icons-material';
import { useAuth } from '../../../../../hooks/useAuth';
import isAuthorized from '../../auth/authguard/isAuthorized';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatContainer() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

// Inside your component
const { user, isLoading } = useAuth();


// Redirect if not authenticated
useEffect(() => {
  if (!isLoading && !user) {
    router.replace('/');
  }
}, [isLoading, user, router]);

// Prevent SSR mismatch
if (typeof window === 'undefined' || isLoading || !user) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="h1">
            AI Assistant
          </Typography>
        </Box>

        {/* Messages Area */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SmartToy sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Start a conversation with your AI assistant
              </Typography>
            </Box>
          )}

          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ maxWidth: '70%' }}>
                {!msg.isUser && (
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <SmartToy />
                  </Avatar>
                )}

                <Card sx={{
                  bgcolor: msg.isUser ? 'primary.main' : 'grey.100',
                  color: msg.isUser ? 'white' : 'text.primary'
                }}>
                  <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="body2">
                      {msg.text}
                    </Typography>
                  </CardContent>
                </Card>

                {msg.isUser && (
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Person />
                  </Avatar>
                )}
              </Stack>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SmartToy />
                </Avatar>
                <Card sx={{ bgcolor: 'grey.100' }}>
                  <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>
                      AI is thinking...
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <Send />
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}