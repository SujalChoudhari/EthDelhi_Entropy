"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/utils/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function TransferMoney({
  transferData = {
    recipientName: "",
    amount: 0,
    accountOptions: [
      [1, 2, 'savings', 5000, 25000, 'Medium', 12, 20, 1000, 1],
      [2, 2, 'savings', 5000, 25000, 'Medium', 12, 20, 1000, 1]
    ]
  }
}) {
  const [fromAccount, setFromAccount] = useState(transferData.accountOptions[0][0]);
  const [toAccount, setToAccount] = useState(transferData.recipientName || "");
  const [amount, setAmount] = useState(transferData.amount || 0);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const selectedAccount = transferData.accountOptions.find(acc => acc[0] === fromAccount);


  useEffect(() => {
    const dataFetcher = async () => {
      const accounts = (await api("accounts/find/"))["accounts"]
      console.log(accounts)
      transferData.accountOptions = accounts;
    }


    dataFetcher()

  }, [])

  const handleTransfer = async () => {
    if (!toAccount) {
      toast.error("Please enter recipient name");
      return;
    }

    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!password) {
      toast.error("Please enter your device password");
      return;
    }

    if (selectedAccount && amount > (selectedAccount[3] as number)) {
      toast.error("Insufficient funds");
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (password !== "1234") { // Example password validation
      setIsProcessing(false);
      toast.error("Incorrect password");
      return;
    }

    setIsProcessing(false);
    setIsCompleted(true);
    toast.success(`₹${amount.toFixed(2)} transferred to ${toAccount}`);
  };

  if (isCompleted) {
    return (
      <motion.div
        className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-xl shadow-md text-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Transfer Complete</h3>
            <p className="opacity-90">₹{amount.toFixed(2)} transferred to {toAccount}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-zinc-800/90 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Transfer Money</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1.5 block">From Account</label>
          <Select defaultValue={fromAccount as string} onValueChange={setFromAccount}>
            <SelectTrigger className="w-full dark:bg-zinc-700 border-zinc-200 dark:border-zinc-700">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {transferData.accountOptions.map(account => (
                <SelectItem key={account[0]} value={account[0] as string}>
                  <div className="flex justify-between items-center w-full">
                    <span>{account[2]}{" "}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm">₹{(account[3] as number)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1.5 block">To Account</label>
          <Input
            placeholder="Recipient name"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="dark:bg-zinc-700 border-zinc-200 dark:border-zinc-700"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1.5 block">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
            <Input
              type="number"
              placeholder="0.00"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="pl-8 dark:bg-zinc-700 border-zinc-200 dark:border-zinc-700"
            />
          </div>
        </div>

        <Button
          
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Transfer Money</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  );
} 