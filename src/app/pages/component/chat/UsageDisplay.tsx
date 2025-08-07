'use client';
import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Chip, LinearProgress, Alert } from '@mui/material';

export interface UsageData {
  dailyusage: number;
  limit: number;
}

export default function UsageDisplay({
  userId,
  onUsageUpdate,
  refreshTrigger, // Add this prop to trigger manual refreshes
}: {
  userId: string;
  onUsageUpdate?: (usage: UsageData) => void;
  refreshTrigger?: number; // Optional prop that when changed, triggers a refresh
}) {
  const [dailyUsage, setDailyUsage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/agents/daily-limit?id=${userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const usageData = {
        dailyusage: data.dailyusage || 0,
        limit: data.limit || 10,
      };
      setDailyUsage(usageData.dailyusage);
      setLimit(usageData.limit);
      onUsageUpdate?.(usageData);
    } catch (err) {
      setError('Failed to load usage data');
    } finally {
      setLoading(false);
    }
  }, [userId, onUsageUpdate]);

  useEffect(() => {
    if (userId) fetchUsage();
  }, [userId, fetchUsage]);

  useEffect(() => {
    if (refreshTrigger !== undefined && userId) {
      fetchUsage();
    }
  }, [refreshTrigger, fetchUsage, userId]);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchUsage();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [userId, fetchUsage]);

  const progressValue = limit > 0 ? (dailyUsage / limit) * 100 : 0;
  const remainingMessages = Math.max(0, limit - dailyUsage);

  if (loading)
    return (
      <Box p={2}>
        <Typography variant="body2">Loading usage...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box display="flex" justifyContent="space-between" mb={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">Daily Usage</Typography>

        {dailyUsage >= limit ? (
          <button
            style={{
              backgroundColor: '#9b59b6', // Purple
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => window.location.href = '/upgrade'} // Replace with actual upgrade page
          >
            Upgrade
          </button>
        ) : (
          <Chip label="FREE" size="small" />
        )}
      </Box>

      <LinearProgress
        value={progressValue}
        variant="determinate"
        color={dailyUsage >= limit ? 'error' : 'primary'}
        sx={{ mb: 1 }}
      />

      
    </Box>
  );
}
