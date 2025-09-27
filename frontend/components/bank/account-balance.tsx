"use client";

import { motion } from "framer-motion";

import api from "@/utils/api";
import { useEffect, useState } from "react";

type AccountBalanceProps = {
  balanceData?: {
    checking: {
      balance: number;
      accountNumber: string;
      availableBalance: number;
    };
    savings: {
      balance: number;
      accountNumber: string;
      interestRate: number;
    };
    creditCard: {
      balance: number;
      availableCredit: number;
      dueDate: string;
      lastFourDigits: string;
    };
    lastUpdated: string;
  };
};



export function AccountBalance({ balanceData }: AccountBalanceProps) {
  // Display loading skeleton if no data is provided


  if (!balanceData) {
    return (
      <div className="w-full max-w-md p-4 border rounded-lg bg-background/50 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-14 bg-muted rounded"></div>
          <div className="h-14 bg-muted rounded"></div>
          <div className="h-14 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const { checking, savings, creditCard, lastUpdated } = balanceData;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const dataFetcher = async () => {
      const accounts = await api("accounts/find/");
      setData(accounts["accounts"]);
    }

    dataFetcher();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="w-full max-w-md p-5 border rounded-lg shadow-sm bg-background"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-medium mb-4">Account Summary</h3>

      <div className="space-y-4">
        {/* Checking Account */}
        {data.length > 0 && data.map((account) => {
          return <div className="p-3 rounded-md border bg-muted/30" key={account[0]}>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{account[2]} (•••• {account[0]})</span>
              <span className="text-sm text-muted-foreground">Age of account: {account[6]}</span>
            </div>
            <div className="mt-1 text-xl font-semibold">{"  "}Available: {formatCurrency(account[3])}</div>
          </div>
        })}

      </div>

      <div className="mt-4 text-xs text-muted-foreground text-right">
        Last updated: {lastUpdated}
      </div>
    </motion.div>
  );
} 