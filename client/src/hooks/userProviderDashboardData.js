import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProviderDashboardStats } from '../api/providerApi';

export default function useProviderDashboardData() {
  const { authState } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authState?.token) return;

    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const data = await getProviderDashboardStats(authState.token);
        setStats(data);
      } catch (err) {
        setError('Failed to load provider stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [authState?.token]);

  return { stats, loading, error };
}
