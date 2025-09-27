import { useState } from 'react';
import { ethers } from 'ethers';

// ABI for StrategyRatings contract
const ABI = [
  "event Rated(string indexed strategyId, address indexed rater, uint8 score)",
  "function rate(string strategyId, uint8 score)",
  "function getRating(string strategyId) view returns (uint256 average, uint256 count)"
];

export function useStrategyRatingsContract(contractAddress: string) {
  const [loading, setLoading] = useState(false);

  async function rate(strategyId: string, score: number) {
    if (!window.ethereum) throw new Error('MetaMask not found');
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const tx = await contract.rate(strategyId, score);
      await tx.wait();
      setLoading(false);
      return true;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  async function getRating(strategyId: string): Promise<{ average: number, count: number }> {
    if (!window.ethereum) throw new Error('MetaMask not found');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const [average, count] = await contract.getRating(strategyId);
    return { average: Number(average), count: Number(count) };
  }

  return { rate, getRating, loading };
}
