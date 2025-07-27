import { Box, Stack, Avatar, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import { Message } from '../../../../../types/message';

export default function MessageList({ messages, loading, bottomRef }: {
  messages: Message[];
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
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
        <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start', mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ maxWidth: '70%' }}>
            {!msg.isUser && <Avatar sx={{ bgcolor: 'primary.main' }}><SmartToy /></Avatar>}
            <Card sx={{ bgcolor: msg.isUser ? 'primary.main' : 'grey.100', color: msg.isUser ? 'white' : 'text.primary' }}>
              <CardContent sx={{ py: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
              </CardContent>
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