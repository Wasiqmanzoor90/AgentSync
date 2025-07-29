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
} from '@mui/material';

interface Message {
  id: string;
  content: string;
  createdAt: string;
}

interface Props {
  userId: string;
}

export default function SearchHistoryPanel({ userId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/agents/inputData?id=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
     setMessages(data.data || []);

      } catch (error: any) {
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSearchHistory();
    }
  }, [userId]);

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 2, height: '300px', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        🔍 Search History
      </Typography>

      {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && messages.length === 0 && !error && (
        <Typography color="text.secondary">No search history found.</Typography>
      )}

      <List>
        {messages.map((msg) => (
          <ListItem key={msg.id} disablePadding>
            <ListItemText
              primary={msg.content}
              secondary={new Date(msg.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
