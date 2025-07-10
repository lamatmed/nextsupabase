/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName: string;
  phone: string;
  isAdmin: boolean;
  isBlocked: boolean;
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(isLoggedIn);
      
      if (isLoggedIn) {
        try {
          // Récupérer les données utilisateur depuis l'API
          const res = await fetch("/api/user");
          if (res.ok) {
            const userData = await res.json();
            setUser(userData.user);
          } else {
            // Si l'API échoue, déconnecter l'utilisateur
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          localStorage.removeItem("isLoggedIn");
          setIsLoggedIn(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (userData: User) => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    setUser(userData);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/login");
  }, [router]);

  return { isLoggedIn, user, loading, login, logout };
} 