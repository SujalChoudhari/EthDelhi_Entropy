// src/useStrategyRatingsContract.ts

import { useState, useMemo, useCallback } from 'react';
import { ethers, Signer } from 'ethers';
import { useMetamask } from './useMetamask';
import { RatingSystemAbi } from '@/contracts/RatingSystem';

interface RatingData {
    average: number;
    count: number;
}

interface ContractHook {
    rate: (itemId: number, rating: number) => Promise<void>;
    getRating: (itemId: number) => Promise<RatingData>;
    loading: boolean;
}

export const useStrategyRatingsContract = (contractAddress: string): ContractHook => {
    const [loading, setLoading] = useState(false);
    const { provider, signer } = useMetamask(); 

    // Create a contract instance, cast to the TypeChain interface
    const contract: any | null = useMemo(() => {
        if (!provider) return null;

        const runner = (signer || provider) as any;

        return new ethers.Contract(
            contractAddress,
            RatingSystemAbi,
            runner
        );
    }, [contractAddress, provider, signer]);

    // 💡 FIX FOR LAG: Memoize getRating using useCallback
    const getRating = useCallback(async (itemId: number): Promise<RatingData> => {
        if (!contract) {
            // Return default if no contract instance is available (e.g., wallet disconnected)
            return { average: 0, count: 0 }; 
        }
        
        try {
            // Read-only calls are safe and correctly typed now
            const averageBigInt: any = await contract.getAverageRating(itemId);
            const countBigInt: any = await contract.numRatings(itemId);

            return {
                average: Number(averageBigInt),
                count: Number(countBigInt)
            };
        } catch (error) {
            console.error("Error fetching on-chain rating:", error);
            return { average: 0, count: 0 }; 
        }
    }, [contract]); // Only recreate if the contract object changes

    // 💡 FIX FOR LAG: Memoize rate using useCallback
    const rate = useCallback(async (itemId: number, rating: number): Promise<void> => {
        if (!contract || !signer) {
            throw new Error("Wallet not connected for transaction.");
        }
        
        setLoading(true);
        try {
            // Ensure the contract instance uses the Signer for the transaction
            const contractWithSigner: any = contract.connect(signer as Signer);

            // Send transaction
            const tx: any = await contractWithSigner.submitRating(itemId, rating);
            
            // Wait for mining
            await tx.wait(); 

            console.log(`Rating transaction successful: ${tx.hash}`);
        } catch (error) {
            console.error("Error submitting on-chain rating:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [contract, signer]); // Only recreate if contract or signer changes

    return {
        rate,
        getRating,
        loading,
    };
};