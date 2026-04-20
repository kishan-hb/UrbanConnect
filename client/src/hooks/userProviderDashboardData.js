import { useEffect, useState } from 'react';

export default function useProviderDashboardData() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/provider/me/dashboard-stats');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load provider stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, loading, error };
}