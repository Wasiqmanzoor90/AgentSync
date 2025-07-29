'use client';
import { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Paper, TextField, Button, Typography, Container, Stack, Alert } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useAuth } from '../../../../hooks/useAuth';
import LoadingData from '../component/loading/isLoading';
import UsageDisplay, { UsageData } from '../../pages/component/chat/UsageDisplay';
import MessageList from '../../pages/component/chat/MessageList';
import { Message } from '../../../../types/message';
import SearchHistoryPanel from '../component/chat/inputData';
import { Delete } from '@mui/icons-material';

export default function ChatContainer() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [currentUsage, setCurrentUsage] = useState<UsageData>({ dailyusage: 0, limit: 5 });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isLoading && !user) router.replace('/');
  }, [isLoading, user, router]);

  if (isLoading || !user) return <LoadingData />;

  const sendMessage = async () => {
    if (!input.trim() || loading || currentUsage.dailyusage >= currentUsage.limit) return;

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
      // 1. Send to AI API
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

      // 2. Save user message to DB
      await fetch('/api/agents/inputData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, content: messageText }),
      });

      // 3. Increment usage
      const incrementRes = await fetch('/api/agents/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!incrementRes.ok) {
        const errorData = await incrementRes.json();
        if (incrementRes.status === 429) {
          setUsageError(errorData.error || 'Rate limit exceeded');
        } else {
          console.warn('Failed to increment usage:', errorData);
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

  const DeleteMessage  = async(messageId : any)=>
    {
      try {
        const res = await fetch(`/api/agents/userInput${messageId}`,
          {
            method :"DELETE",
            headers : {'Content-Type': 'application/json',}
          }
        );
        const data = await res.json();
        console.log("Deleted:", data);
      } catch (error) {
          console.error("Request error:", error);
      }
    }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">AI Assistant</Typography>
        </Box>

        <UsageDisplay userId={user.id} onUsageUpdate={setCurrentUsage} />

        {usageError && (
          <Alert severity="error" sx={{ m: 2 }}>
            {usageError}
          </Alert>
        )}

        <MessageList
          messages={messages}
          loading={loading}
          bottomRef={messagesEndRef as RefObject<HTMLDivElement>}
        />

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1}>
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
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={loading || !input.trim() || currentUsage.dailyusage >= currentUsage.limit}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <Send />
            </Button>
          </Stack>
        </Box>
      </Paper>

     <Box sx={{ mt: 3 }}>
      <SearchHistoryPanel userId={user.id} />
    </Box>
    </Container>
  );
}
