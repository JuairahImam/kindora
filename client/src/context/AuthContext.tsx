"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types/user";
import { API_BASE_URL } from "@/lib/api";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  updateUser: (user: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken =
          localStorage.getItem("kindora_token") ||
          sessionStorage.getItem("kindora_token");
        const storedUser = localStorage.getItem("kindora_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        // Validate session with server if token exists
        if (storedToken) {
          const res = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.data) {
              setUser(data.data);
              localStorage.setItem("kindora_user", JSON.stringify(data.data));
            }
          }
        }
      } catch (err) {
        console.error("Auth session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, newUser: IUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("kindora_token", newToken);
    localStorage.setItem("kindora_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("kindora_token");
    localStorage.removeItem("kindora_user");
    sessionStorage.removeItem("kindora_token");
  };

  const updateUser = (updatedFields: Partial<IUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("kindora_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
