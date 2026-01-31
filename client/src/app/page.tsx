"use client";

import { useEffect, useState } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on?: (event: string, listener: (...args: any[]) => void) => void;
      removeListener?: (
        event: string,
        listener: (...args: any[]) => void,
      ) => void;
    };
  }
}

export default function Home() {
  const { method, walletAddress: googleWallet, googleUser, logout } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<
    "success" | "warning" | "error" | null
  >(null);
  const router = useRouter();

  const SEPOLIA_CHAIN_ID = "0xaa36a7";

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const checkNetwork = async () => {
    if (!window.ethereum) {
      return false;
    }

    const chainId = (await window.ethereum.request({
      method: "eth_chainId",
    })) as string;
    if (chainId !== SEPOLIA_CHAIN_ID) {
      setStatusType("warning");
      setStatusMessage("Wrong network. Please switch to Sepolia.");
      return false;
    }

    return true;
  };

  const handleMetaMaskConnect = async () => {
    if (!window.ethereum) {
      setStatusType("error");
      setStatusMessage(
        "MetaMask is not installed. Please install it to continue.",
      );
      return;
    }

    setIsConnecting(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      const isSepolia = await checkNetwork();
      if (isSepolia) {
        setStatusType("success");
        setStatusMessage("Wallet connected on Sepolia.");
      }
    } catch (error) {
      setStatusType("error");
      setStatusMessage("Wallet connection failed or was cancelled.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAdminLogin = () => {
    router.push("/admin");
  };

  const handleVoterDashboard = () => {
    router.push("/dashboard");
  };
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (!window.ethereum) {
        setStatusType("error");
        setStatusMessage(
          "MetaMask is not installed. Please install it to continue.",
        );
        return;
      }

      try {
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          const isSepolia = await checkNetwork();
          if (isSepolia) {
            setStatusType("success");
            setStatusMessage("Wallet connected on Sepolia.");
          }
        }
      } catch {
        setStatusType("error");
        setStatusMessage("Unable to read wallet status.");
      }
    };

    checkExistingConnection();
  }, []);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum?.on) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletAddress(null);
        setStatusType("warning");
        setStatusMessage("Wallet disconnected.");
      } else {
        setWalletAddress(accounts[0]);
        setStatusType("success");
        setStatusMessage("Wallet connected.");
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (chainId !== SEPOLIA_CHAIN_ID) {
        setStatusType("warning");
        setStatusMessage("Wrong network. Please switch to Sepolia.");
      } else {
        setStatusType("success");
        setStatusMessage("Connected to Sepolia.");
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-200 rounded-2xl shadow-2xl p-8 border border-gray-400">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="Loktantra Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loktantra</h1>
            <p className="text-xl text-gray-600 mb-1">
              Secure. Transparent. Democratic.
            </p>
            <p className="text-gray-500">Cast your vote on the blockchain.</p>
          </div>

          {/* MetaMask Login Section */}
          <button
            onClick={handleMetaMaskConnect}
            disabled={isConnecting}
            className="w-full bg-blue-600 text-white py-4  rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center mb-4"
          >
            {isConnecting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-3"></i>
                Connecting...
              </>
            ) : (
              <>
                <i className="fas fa-wallet mr-2"></i>
                {walletAddress
                  ? `Connected: ${shortenAddress(walletAddress)}`
                  : "Connect MetaMask Wallet"}
              </>
            )}
          </button>
          {walletAddress && (
            <button
              onClick={handleVoterDashboard}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center mb-4"
            >
              <i className="fas fa-landmark mr-2"></i>
              Go to Voter Dashboard
            </button>
          )}

          {statusMessage && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
                statusType === "success"
                  ? "bg-green-100 text-green-800"
                  : statusType === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <button
            onClick={handleAdminLogin}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center mb-6 cursor-pointer"
          >
            <i className="fas fa-user-shield mr-2"></i>
            Admin Login
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-200 text-gray-700">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Google Sign-In Section */}
          <div className="mb-8">
            <GoogleSignInButton />
            {method === "google" && googleUser && googleWallet && (
              <div className="bg-white rounded-lg p-4 mt-2 text-center">
                <img
                  src={googleUser.image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                />
                <div className="font-semibold text-gray-800">
                  {googleUser.name}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {googleUser.email}
                </div>
                <div className="text-xs text-gray-700 mb-2">
                  Wallet: <span className="font-mono">{googleWallet}</span>
                </div>
                <button
                  onClick={logout}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">
              POWERED BY ETHEREUM BLOCKCHAIN
            </p>
            <div className="flex justify-center space-x-8 text-xs text-gray-400">
              <div className="flex items-center">
                <i className="fas fa-lock mr-1"></i>
                256-bit Encryption
              </div>
              <div className="flex items-center">
                <i className="fas fa-shield-alt mr-1"></i>
                Tamper-Proof
              </div>
              <div className="flex items-center">
                <i className="fas fa-clipboard-check mr-1"></i>
                Fully Auditable
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
