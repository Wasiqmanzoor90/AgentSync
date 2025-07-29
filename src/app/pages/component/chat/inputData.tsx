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
} from '@mui/material';
import { MoreVert, Delete } from '@mui/icons-material';

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
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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
          <ListItem 
            key={msg.id} 
            disablePadding
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover .menu-button': {
                opacity: 1,
              }
            }}
          >
            <ListItemText
              primary={msg.content}
              secondary={new Date(msg.createdAt).toLocaleString()}
              sx={{ flex: 1 }}
            />
            
            <IconButton
              className="menu-button"
              size="small"
              onClick={(e) => handleMenuOpen(e, msg)}
              disabled={deleteLoading === msg.id}
              sx={{
                opacity: 0.7,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1,
                }
              }}
            >
              {deleteLoading === msg.id ? (
                <CircularProgress size={16} />
              ) : (
                <MoreVert fontSize="small" />
              )}
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Delete Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => selectedMessage && deleteMessage(selectedMessage.id)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}