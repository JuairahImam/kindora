"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types/user";
import { getApiBaseUrl } from "@/lib/api";

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerWithEmail: (
    name: string,
    email: string,
    password: string,
    photoURL?: string
  ) => Promise<{ success: boolean; message?: string }>;
  loginWithGitHub: () => Promise<void> | void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const storedToken =
          typeof window !== "undefined"
            ? localStorage.getItem("kindora_token") || sessionStorage.getItem("kindora_token")
            : null;
        const storedUser =
          typeof window !== "undefined" ? localStorage.getItem("kindora_user") : null;

        if (storedToken && storedUser) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem("kindora_user");
          }
        }

        // Only verify with server if a token/user was stored or after OAuth redirect
        const hasSessionIndicator =
          Boolean(storedToken) ||
          Boolean(storedUser) ||
          (typeof window !== "undefined" &&
            (window.location.search.includes("code=") ||
              window.location.search.includes("state=")));

        if (!hasSessionIndicator) {
          setLoading(false);
          return;
        }

        // Verify with server using cookies/headers
        const res = await fetch(`${baseUrl}/api/me`, {
          credentials: "include",
          headers: storedToken
            ? {
                Authorization: `Bearer ${storedToken}`,
              }
            : {},
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("kindora_user", JSON.stringify(data.user));

            // Fetch JWT token if not yet stored
            if (!storedToken) {
              const tokenRes = await fetch(`${baseUrl}/api/auth/token`, {
                credentials: "include",
              }).catch(() => null);
              if (tokenRes && tokenRes.ok) {
                const tokenData = await tokenRes.json();
                if (tokenData?.token) {
                  setToken(tokenData.token);
                  localStorage.setItem("kindora_token", tokenData.token);
                }
              }
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

  // Email and Password Login
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          message:
            data?.message ||
            data?.error?.message ||
            "Invalid email or password. Please try again.",
        };
      }

      // Extract user
      const authUser: IUser = {
        id: data?.user?.id || data?.user?._id,
        _id: data?.user?._id || data?.user?.id,
        name: data?.user?.name,
        email: data?.user?.email,
        image: data?.user?.image,
        emailVerified: data?.user?.emailVerified,
      };

      // Extract or fetch JWT Token
      let jwtToken = data?.token;
      if (!jwtToken) {
        const tokenRes = await fetch(`${baseUrl}/api/auth/token`, {
          credentials: "include",
        }).catch(() => null);
        if (tokenRes && tokenRes.ok) {
          const tokenData = await tokenRes.json();
          jwtToken = tokenData?.token;
        }
      }

      if (jwtToken) {
        setToken(jwtToken);
        localStorage.setItem("kindora_token", jwtToken);
      }

      setUser(authUser);
      localStorage.setItem("kindora_user", JSON.stringify(authUser));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Network error occurred",
      };
    }
  };

  // Register with Email and Password
  const registerWithEmail = async (
    name: string,
    email: string,
    password: string,
    photoURL?: string
  ) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          image: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        let msg = data?.message || data?.error?.message;
        if (res.status === 422 || msg?.toLowerCase().includes("already exists")) {
          msg = "An account with this email already exists. Please log in instead.";
        }
        return {
          success: false,
          message: msg || "Registration failed. Please check your details.",
        };
      }

      const authUser: IUser = {
        id: data?.user?.id || data?.user?._id,
        _id: data?.user?._id || data?.user?.id,
        name: data?.user?.name || name,
        email: data?.user?.email || email,
        image: data?.user?.image || photoURL,
        emailVerified: data?.user?.emailVerified,
      };

      // Get JWT Token
      let jwtToken = data?.token;
      if (!jwtToken) {
        const tokenRes = await fetch(`${baseUrl}/api/auth/token`, {
          credentials: "include",
        }).catch(() => null);
        if (tokenRes && tokenRes.ok) {
          const tokenData = await tokenRes.json();
          jwtToken = tokenData?.token;
        }
      }

      if (jwtToken) {
        setToken(jwtToken);
        localStorage.setItem("kindora_token", jwtToken);
      }

      setUser(authUser);
      localStorage.setItem("kindora_user", JSON.stringify(authUser));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Network error occurred",
      };
    }
  };

  // GitHub OAuth Login
  const loginWithGitHub = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      const callbackURL = typeof window !== "undefined" ? window.location.origin : "";
      
      const res = await fetch(`${baseUrl}/api/auth/sign-in/social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          provider: "github",
          callbackURL,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.href = data.url;
      } else {
        // Fallback to direct redirect if POST didn't return URL
        window.location.href = `${baseUrl}/api/auth/sign-in/social?provider=github&callbackURL=${encodeURIComponent(callbackURL)}`;
      }
    } catch {
      // Fallback on network/fetch error
      const baseUrl = getApiBaseUrl();
      const callbackURL = typeof window !== "undefined" ? window.location.origin : "";
      window.location.href = `${baseUrl}/api/auth/sign-in/social?provider=github&callbackURL=${encodeURIComponent(callbackURL)}`;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      }).catch(() => null);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("kindora_token");
      localStorage.removeItem("kindora_user");
      sessionStorage.removeItem("kindora_token");
    }
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
      value={{
        user,
        token,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGitHub,
        logout,
        updateUser,
      }}
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
