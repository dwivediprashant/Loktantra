import { useState } from "react";
import { BrowserProvider, Contract, Eip1193Provider } from "ethers";
import CONTRACT_ABI from "../contracts/Loktantra.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

interface VoteButtonProps {
  candidateId: number;
}

interface EthereumWindow extends Window {
  ethereum?: Eip1193Provider;
}

const VoteButton: React.FC<VoteButtonProps> = ({ candidateId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const castVote = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { ethereum } = window as EthereumWindow;

      if (!ethereum) {
        throw new Error("MetaMask not detected");
      }

      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const contract = new Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI.abi,
        signer
      );

      const tx = await contract.vote(candidateId);

      console.log("TX Sent:", tx.hash);

      await tx.wait();

      setSuccess(true);
    } catch (err: any) {
      console.error("Vote failed:", err);

      const message =
        err?.reason ||
        err?.shortMessage ||
        err?.message ||
        "Transaction failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={castVote}
        disabled={loading || success}
        className={`px-4 py-2 rounded-lg font-semibold text-white transition-all
          ${
            success
              ? "bg-green-600"
              : loading
              ? "bg-yellow-500"
              : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        {success
          ? "Voted Successfully ✅"
          : loading
          ? "Transaction Pending ⏳"
          : "Vote"}
      </button>

      {error && (
        <p className="text-sm text-red-500 font-medium">
          ❌ {error}
        </p>
      )}
    </div>
  );
};

export default VoteButton;
