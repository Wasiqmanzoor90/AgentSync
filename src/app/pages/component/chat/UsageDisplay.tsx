// components/UsageDisplay.tsx
'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Chip, LinearProgress, Alert } from '@mui/material';

export interface UsageData {
  dailyusage: number;
  limit: number;
}

export default function UsageDisplay({
  userId,
  onUsageUpdate,
}: {
  userId: string;
  onUsageUpdate?: (usage: UsageData) => void;
}) {
  const [dailyUsage, setDailyUsage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/agents/daily-limit?id=${userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const usageData = {
        dailyusage: data.dailyusage || 0,
        limit: data.limit || 5,
      };
      setDailyUsage(usageData.dailyusage);
      setLimit(usageData.limit);
      onUsageUpdate?.(usageData);
    } catch (err) {
      setError('Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUsage();
  }, [userId]);

  const progressValue = limit > 0 ? (dailyUsage / limit) * 100 : 0;
  const remainingMessages = Math.max(0, limit - dailyUsage);

  if (loading)
    return <Box p={2}><Typography variant="body2">Loading usage...</Typography></Box>;
  if (error)
    return <Box p={2}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="text.secondary">Daily Usage</Typography>
        <Chip label="FREE" size="small" />
      </Box>
      <LinearProgress value={progressValue} variant="determinate" color={dailyUsage >= limit ? 'error' : 'primary'} sx={{ mb: 1 }} />
      <Typography variant="caption" color="text.secondary">
        {dailyUsage} / {limit} messages used{remainingMessages > 0 && ` (${remainingMessages} remaining)`}
      </Typography>
      {dailyUsage >= limit && <Alert severity="warning" sx={{ mt: 1 }}>Daily limit reached! Upgrade to continue.</Alert>}
    </Box>
  );
}
