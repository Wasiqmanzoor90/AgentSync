import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import isAuthorized from "../utils/isAuthorized";

export const useAuth = () => {
  const [user, setUser] = useState<{ email: string; userId: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const tokenUser = await isAuthorized();
      if (!tokenUser) {
        router.replace("/login");
      } else {
        setUser(tokenUser);
      }
    };

    checkAuth();
  }, [router]); // It's good practice to include router in the dependency array

  return { user };
};
