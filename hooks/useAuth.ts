import { useEffect, useState } from 'react';
import type { User } from '../types/User'; // adjust path if needed
import isAuthorized from '@/app/pages/auth/authguard/isAuthorized';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // ✅ use full User type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokenUser = await isAuthorized();
        setUser(tokenUser);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, isLoading };
};
