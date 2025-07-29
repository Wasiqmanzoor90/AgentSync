import { Box, Stack, Avatar, Card, CardContent, Typography, CircularProgress, IconButton } from '@mui/material';
import { Person, SmartToy, Delete } from '@mui/icons-material';
import { Message } from '../../../../../types/message';

export default function MessageList({ 
  messages, 
  loading, 
  bottomRef,
  onDeleteMessage,
  deleteLoading
}: {
  messages: Message[];
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
  onDeleteMessage?: (messageId: string) => void;
  deleteLoading?: string | null;
}) {
  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {messages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <SmartToy sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">Start a conversation with your AI assistant</Typography>
        </Box>
      )}

      {messages.map(msg => (
        <Box 
          key={msg.id} 
          sx={{ 
            display: 'flex', 
            justifyContent: msg.isUser ? 'flex-end' : 'flex-start', 
            mb: 2,
            position: 'relative',
            '&:hover .delete-button': {
              opacity: 1,
            }
          }}
        >
          <Stack direction="row" spacing={1} sx={{ maxWidth: '70%' }}>
            {!msg.isUser && <Avatar sx={{ bgcolor: 'primary.main' }}><SmartToy /></Avatar>}
            <Card sx={{ 
              bgcolor: msg.isUser ? 'primary.main' : 'grey.100', 
              color: msg.isUser ? 'white' : 'text.primary',
              position: 'relative'
            }}>
              <CardContent sx={{ py: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
              </CardContent>
              
              {/* Simple Delete button */}
              <IconButton
                className="delete-button"
                onClick={() => onDeleteMessage && onDeleteMessage(msg.id)}
                disabled={deleteLoading === msg.id}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  backgroundColor: 'error.main',
                  color: 'white',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: 'error.dark',
                  },
                }}
                size="small"
              >
                {deleteLoading === msg.id ? (
                  <CircularProgress size={12} color="inherit" />
                ) : (
                  <Delete sx={{ fontSize: 14 }} />
                )}
              </IconButton>
            </Card>
            {msg.isUser && <Avatar sx={{ bgcolor: 'secondary.main' }}><Person /></Avatar>}
          </Stack>
        </Box>
      ))}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}><SmartToy /></Avatar>
            <Card sx={{ bgcolor: 'grey.100' }}>
              <CardContent sx={{ py: 1 }}>
                <Box display="flex" alignItems="center">
                  <CircularProgress size={16} />
                  <Typography variant="body2" sx={{ ml: 1 }}>AI is thinking...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      )}
      <div ref={bottomRef} />
    </Box>
  );
}