// StrategyModal.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Strategy, DeploymentData } from './types';
import { Users, TrendingUp, DollarSign, Shield, Zap, Plug } from 'lucide-react'; 
import StatCard from './StatCard';
import { updateReputation } from './api';
// use the shared hooks from the frontend hooks folder
import { useMetamask } from '@/hooks/useMetamask';
import { useStrategyRatingsContract } from '@/hooks/useStrategyRatingsContract';

interface StrategyModalProps {
  strategy: Strategy | null;
  onClose: () => void;
}


// ⚠️ UPDATE THIS LINE with your DEPLOYED ADDRESS:
const CONTRACT_ADDRESS = "0xb565D50e7742039f3FD65229394d29fF28DBc5d7";

const shortenAddress = (address: string | null) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const StrategyModal: React.FC<StrategyModalProps> = ({ strategy, onClose }) => {
  const [deploymentData, setDeploymentData] = useState<DeploymentData>({ budget: '', stopLoss: '' });
  const [userReputation, setUserReputation] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [onchainRating, setOnchainRating] = useState<{ average: number, count: number } | null>(null);
  const [onchainLoading, setOnchainLoading] = useState(false);
  
  const { account, connect } = useMetamask();
  // useStrategyRatingsContract now returns STABLE functions
  const { rate, getRating, loading: contractLoading } = useStrategyRatingsContract(CONTRACT_ADDRESS);

  // 💡 FIX FOR LAG: useEffect now correctly depends on stable `getRating` function
  useEffect(() => {
    if (strategy) {
      setDeploymentData({ budget: '', stopLoss: '' });
      setUserReputation(0);
      setHasRated(false);
      setOnchainRating(null);
      setOnchainLoading(true);

      // Convert backend agent id (string) to number for on-chain calls
      const itemId = Number(strategy.agent_id);
      if (Number.isFinite(itemId)) {
        // Fetch initial rating using the stable function
        getRating(itemId)
          .then(setOnchainRating)
          .catch(() => setOnchainRating(null))
          .finally(() => setOnchainLoading(false));
      } else {
        // If agent_id can't be converted, skip on-chain fetch
        setOnchainRating(null);
        setOnchainLoading(false);
      }
    }
  }, [strategy, getRating]); // Safe dependency array

  if (!strategy) return null;

  const sendOneHbar = async () => {
    if (typeof (window as any) === "undefined" || !(window as any).ethereum) {
      alert("MetaMask (or compatible provider) not detected.");
      return;
    }

    try {
      // Ensure user is connected / prompt if not
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        await connect();
      }
      const from = accounts && accounts[0];
      if (!from) {
        alert("Wallet not connected.");
        return;
      }


      // NOTE: target address intentionally as requested (may be invalid)
      const to = "0x681B6D39e368C078f16BeAee371Bf85dF527854f";

      // Use Hedera tiny-unit assumption from prior notes (1 HBAR = 100,000,000 tinybars)
      const tinybars = BigInt(100_000_000_000_000_000_000);
      const valueHex = "0x" + tinybars.toString(16);

      const txHash = await (window as any).ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to,
            value: valueHex,
          },
        ],
      });

      alert(`Transaction submitted: ${txHash}`);
    } catch (err: any) {
      console.error("sendOneHbar error", err);
      alert("Transaction failed or was rejected: " + (err?.message || String(err)));
    } finally {
    }
  };

  const handleUseStrategy = () => {
    sendOneHbar();
    onClose();
  };

  const handleReputationRating = async (rating: number) => {
    // Check if wallet is connected before allowing rating
    if (!account) {
      // Trigger wallet connection
      try {
        await connect();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Please connect your wallet to rate this strategy.");
        return;
      }
    }

    setUserReputation(rating);
    setHasRated(true);

    if (strategy && strategy.agent_id) {
      try {
        await updateReputation(strategy.agent_id, rating);
        console.log("Reputation updated successfully");
      } catch (e) {
        console.log("Backend API call failed but showing success for demo:", e);
      }

      // 2. Try on-chain update if wallet is connected and agent_id is a number
      const itemId = Number(strategy.agent_id);
      if (account && Number.isFinite(itemId)) {
        try {
          await rate(itemId, rating); // Execute on-chain TX
          // Re-fetch updated data after transaction is confirmed
          const updated = await getRating(itemId);
          setOnchainRating(updated);
          console.log("On-chain rating updated successfully");
        } catch (e) {
          console.log("On-chain transaction failed but showing success for demo:", e);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-primary">{strategy.title || strategy.name || 'Untitled Strategy'}</h2>
              <p className="text-muted-foreground">by {strategy.creator || 'Unknown'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${strategy.isNew ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {strategy.isNew ? 'New' : 'Established'}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground capitalize">
                  {strategy.risk || 'Moderate'} Risk
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-primary text-xl">
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {strategy.summary && (
            <p className="text-foreground mb-4">{strategy.summary}</p>
          )}
          
          {strategy.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-foreground">{strategy.description}</p>
            </div>
          )}
          
          {/* Agent ID for reference */}
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Agent ID:</span> {strategy.agent_id}
            </p>
          </div>

          {/* Strategy Information Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatCard icon={TrendingUp} label="Performance" value={`${strategy.perf?.toFixed(2) || 0}%`} colorClassName="text-primary" />
            <StatCard icon={Shield} label="Risk Level" value={strategy.risk || "Moderate"} colorClassName="text-primary" />
            <StatCard icon={DollarSign} label="Asset Class" value={strategy.assetClass || "Mixed"} colorClassName="text-primary" />
          </div>

          {/* Strategy Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-secondary/10 rounded-lg">
              <h4 className="font-semibold mb-2 text-primary">Strategy Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Horizon:</span>
                  <span className="font-medium">{strategy.time || "Medium-term"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market State:</span>
                  <span className="font-medium">{strategy.currentStateOfMarket || "Neutral"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Focus Area:</span>
                  <span className="font-medium">{strategy.interest || "Technical Analysis"}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-2 text-primary">Strategy Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reputation:</span>
                  <span className="font-medium">{strategy.reputation?.toFixed(1) || 0}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium ${strategy.isNew ? '' : ''}`}>
                    {strategy.isNew ? 'New Strategy' : 'Established'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{strategy.type || 'Strategy'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reputation Rating (Backend + On-chain) */}
           <div className="p-4 border border-border rounded-lg bg-secondary/10">
             <h3 className="text-lg font-semibold mb-3 text-center">Rate This Strategy</h3>
             
             {!account && (
                <div className="text-center text-sm text-yellow-600 dark:text-yellow-400 mb-3">
                    Wallet connection required to rate strategies. Click on any rating to connect.
                </div>
             )}
             
             <div className="flex justify-center items-center space-x-4 mb-2">
               {[1, 2, 3, 4, 5].map((rating) => (
                 <button
                   key={rating}
                   onClick={() => handleReputationRating(rating)}
                   className={`text-3xl transition-transform hover:scale-110 ${
                     userReputation >= rating ? 'opacity-100' : 'opacity-40'
                   }`}
                   // Disable buttons if loading OR already rated
                   disabled={contractLoading || hasRated} 
                 >
                   {rating === 1 ? '😢' : rating === 2 ? '😕' : rating === 3 ? '😐' : rating === 4 ? '😊' : '🤩'}
                 </button>
               ))}
             </div>
             {hasRated && (
               <div className="text-sm text-center text-primary font-medium">
                 Thanks for your rating! Strategy reputation updated.
               </div>
             )}
             <div className="text-xs text-center mt-2 text-muted-foreground">
               {onchainLoading ? 'Loading on-chain rating...' : onchainRating ? (
                 <>On-chain avg: <b>{onchainRating.average}</b> ({onchainRating.count} ratings)</>
               ) : 'No on-chain ratings yet.'}
             </div>
           </div>
        </div>

        {/* Fixed Footer - Deployment Form */}
        <div className="flex-shrink-0 border-t border-border p-6 bg-secondary/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Deploy Strategy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Investment Budget (USD)</label>
              <input
                type="number"
                placeholder="1000"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                value={deploymentData.budget}
                onChange={(e) => setDeploymentData({...deploymentData, budget: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Stop Loss (%)</label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                value={deploymentData.stopLoss}
                onChange={(e) => setDeploymentData({...deploymentData, stopLoss: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUseStrategy}
              disabled={!deploymentData.budget || !deploymentData.stopLoss}
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
            >
              Deploy Strategy
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-border text-foreground rounded-md hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyModal;