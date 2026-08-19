"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { LoginInput, RegisterInput, UserDto } from "@pizza/shared-types";
import * as authClient from "@/lib/auth-client";

type AuthContextValue = {
  user: UserDto | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authClient.getMe().then((me) => {
      if (!cancelled) {
        setUser(me);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(input: LoginInput) {
    setUser(await authClient.login(input));
  }

  async function register(input: RegisterInput) {
    setUser(await authClient.register(input));
  }

  async function logout() {
    await authClient.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
