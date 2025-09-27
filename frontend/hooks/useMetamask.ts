// src/useMetamask.ts
import { useState, useEffect } from 'react';
import { ethers, BrowserProvider, Signer } from 'ethers';

interface MetamaskHook {
    account: string | null;
    signer: Signer | null;
    provider: BrowserProvider | null;
    connect: () => Promise<void>;
}

// Global variable for the injected provider (MetaMask)
declare global {
    interface Window {
        ethereum?: any;
    }
}

export const useMetamask = (): MetamaskHook => {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);

    // Effect to detect MetaMask on load and update account status
    useEffect(() => {
        if (window.ethereum) {
            const browserProvider = new BrowserProvider(window.ethereum);
            setProvider(browserProvider);

            // Check if accounts are already connected
            window.ethereum.request({ method: 'eth_accounts' })
                .then(handleAccountsChanged)
                .catch(console.error);

            // Set up listener for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
            const newAccount = accounts[0];
            setAccount(newAccount);
            if (provider) {
                // Get the signer (the user's wallet object for signing transactions)
                const newSigner = await provider.getSigner(newAccount);
                setSigner(newSigner);
            }
        } else {
            setAccount(null);
            setSigner(null);
        }
    };

    const connect = async () => {
        if (window.ethereum) {
            try {
                // Request account access (triggers the MetaMask pop-up)
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                await handleAccountsChanged(accounts);
            } catch (error) {
                console.error("User rejected connection or error occurred:", error);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }
    };

    return { account, signer, provider, connect };
};