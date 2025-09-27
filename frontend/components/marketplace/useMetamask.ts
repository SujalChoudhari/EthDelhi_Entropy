// Add this for TypeScript support
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { useState } from 'react';

export function useMetamask() {
  const [account, setAccount] = useState<string | null>(null);

  async function connect() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      return accounts[0];
    } else {
      throw new Error('MetaMask not found');
    }
  }

  return { account, connect };
}
