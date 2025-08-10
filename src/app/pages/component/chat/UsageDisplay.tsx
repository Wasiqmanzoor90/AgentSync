'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Chip, LinearProgress, Alert } from '@mui/material';

export interface UsageData {
  dailyusage: number;
  limit: number;
}

export default function UsageDisplay({
  userId: propUserId,
  onUsageUpdate,
  refreshTrigger,
}: {
  userId?: string; // optional prop, if missing we get from localStorage
  onUsageUpdate?: (usage: UsageData) => void;
  refreshTrigger?: number;
}) {
  const [userId, setUserId] = useState<string | undefined>(propUserId);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load userId from localStorage if not provided via prop
  useEffect(() => {
    if (!userId && typeof window !== 'undefined') {
      const storedId = localStorage.getItem('id');
      if (storedId) setUserId(storedId);
    }
  }, [userId]);

  const fetchUsage = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/agents/daily-limit?id=${userId}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      const usageData: UsageData = {
        dailyusage: data.dailyusage || 0,
        limit: data.limit || 10,
      };
      setDailyUsage(usageData.dailyusage);
      setLimit(usageData.limit);
      onUsageUpdate?.(usageData);
      setError(null);
    } catch (err) {
      setError('Failed to load usage data');
    } finally {
      setLoading(false);
    }
  }, [userId, onUsageUpdate]);

  // Fetch usage initially & on userId or refreshTrigger change
  useEffect(() => {
    if (userId) fetchUsage();
  }, [userId, fetchUsage]);

  useEffect(() => {
    if (refreshTrigger !== undefined && userId) {
      fetchUsage();
    }
  }, [refreshTrigger, fetchUsage, userId]);

  // Poll usage every 30 seconds
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, [userId, fetchUsage]);

  const progressValue = limit > 0 ? (dailyUsage / limit) * 100 : 0;

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout');
      }
    } catch {
      alert('Error starting checkout');
    }
  };

  if (loading) return <Box p={2}><Typography>Loading usage...</Typography></Box>;
  if (error) return <Box p={2}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box display="flex" justifyContent="space-between" mb={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">Daily Usage</Typography>
        {dailyUsage >= limit ? (
          <button
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onClick={handleUpgrade}
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
