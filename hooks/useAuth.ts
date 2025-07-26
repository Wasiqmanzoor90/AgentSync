// hooks/useAuth.ts
import { useEffect, useState } from "react";
import isAuthorized from "../src/app/pages/auth/authguard/isAuthorized";


export const useAuth = () => {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
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
