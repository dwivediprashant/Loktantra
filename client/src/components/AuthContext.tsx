// Project Scope Exclusions (per requirements):
// - No voting logic
// - No backend or gas sponsorship logic
// - No changes to MetaMask or wallet connect logic
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type AuthMethod = "metamask" | "google" | null;

interface GoogleUser {
  name: string;
  email: string;
  image: string;
}

interface AuthContextType {
  method: AuthMethod;
  walletAddress: string | null;
  googleUser: GoogleUser | null;
  setAuth: (
    method: AuthMethod,
    walletAddress: string | null,
    googleUser?: GoogleUser | null,
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [method, setMethod] = useState<AuthMethod>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  const setAuth = (
    m: AuthMethod,
    addr: string | null,
    gUser?: GoogleUser | null,
  ) => {
    setMethod(m);
    setWalletAddress(addr);
    setGoogleUser(gUser || null);
  };

  const logout = () => {
    setMethod(null);
    setWalletAddress(null);
    setGoogleUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ method, walletAddress, googleUser, setAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
