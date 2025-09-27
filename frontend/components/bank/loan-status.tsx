"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, ChevronDown, Info } from "lucide-react";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";

interface LoanDetailsProps {
  loanId: string;
  loanName: string;
  amount: number;
  remainingAmount: number;
  nextInstallmentDate: string;
  nextInstallmentAmount: number;
  startDate: string;
  endDate: string;
  interestRate: number;
  category: string;
  additionalDetails: Record<string, string>;
}

interface AccountLoansProps {
  accountId: string;
  accountName: string;
  loans: LoanDetailsProps[];
}

export function LoanStatus({
  loanData = {
    accounts: [
      {
        accountId: "checking",
        accountName: "Checking (••••3456)",
        loans: [
          {
            loanId: "l-001",
            loanName: "Home Mortgage",
            amount: 250000,
            remainingAmount: 198250.45,
            nextInstallmentDate: "2023-06-15",
            nextInstallmentAmount: 1350.75,
            startDate: "2020-03-10",
            endDate: "2050-03-10",
            interestRate: 4.5,
            category: "Mortgage",
            additionalDetails: {
              "Property Address": "123 Main St, Anytown",
              "Loan Term": "30 years",
              "Payment Frequency": "Monthly",
              "Loan Status": "In good standing"
            }
          },
          {
            loanId: "l-002",
            loanName: "Auto Loan",
            amount: 32000,
            remainingAmount: 15780.32,
            nextInstallmentDate: "2023-06-22",
            nextInstallmentAmount: 525.40,
            startDate: "2021-05-15",
            endDate: "2026-05-15",
            interestRate: 3.75,
            category: "Vehicle",
            additionalDetails: {
              "Vehicle": "2021 Honda Accord",
              "Loan Term": "5 years",
              "Payment Frequency": "Monthly",
              "Loan Status": "In good standing"
            }
          }
        ]
      },
      {
        accountId: "savings",
        accountName: "Savings (••••8901)",
        loans: [
          {
            loanId: "l-003",
            loanName: "Personal Loan",
            amount: 10000,
            remainingAmount: 6540.80,
            nextInstallmentDate: "2023-06-05",
            nextInstallmentAmount: 315.25,
            startDate: "2022-01-10",
            endDate: "2025-01-10",
            interestRate: 7.25,
            category: "Personal",
            additionalDetails: {
              "Purpose": "Home renovation",
              "Loan Term": "3 years",
              "Payment Frequency": "Monthly",
              "Loan Status": "In good standing"
            }
          }
        ]
      }
    ]
  }
}) {
  const [selectedAccount, setSelectedAccount] = useState(loanData.accounts[0]?.accountId || "");
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);
  
  const selectedAccountData = loanData.accounts.find(acc => acc.accountId === selectedAccount);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const getProgressPercentage = (total: number, remaining: number) => {
    const paid = total - remaining;
    return Math.round((paid / total) * 100);
  };
  
  const toggleLoan = (loanId: string) => {
    if (expandedLoan === loanId) {
      setExpandedLoan(null);
    } else {
      setExpandedLoan(loanId);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-zinc-800/90 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm max-w-md w-[500px]"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Loan Status</h3>
      
      {loanData.accounts.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1.5 block">Select Account</label>
            <Select 
              value={selectedAccount} 
              onValueChange={setSelectedAccount}
            >
              <SelectTrigger className="w-full dark:bg-zinc-700 border-zinc-200 dark:border-zinc-700">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {loanData.accounts.map(account => (
                  <SelectItem key={account.accountId} value={account.accountId}>
                    {account.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedAccountData?.loans && selectedAccountData.loans.length > 0 ? (
            <div className="space-y-3">
              {selectedAccountData.loans.map(loan => (
                <div 
                  key={loan.loanId}
                  className="border border-zinc-100 dark:border-zinc-700 rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-3 bg-zinc-50 dark:bg-zinc-750 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleLoan(loan.loanId)}
                  >
                    <div>
                      <h4 className="font-medium text-zinc-800 dark:text-zinc-200">{loan.loanName}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                          {loan.category}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          ₹{loan.remainingAmount.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})} remaining
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedLoan === loan.loanId ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    </motion.div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedLoan === loan.loanId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-3 pb-3 overflow-hidden"
                      >
                        <div className="pt-3 space-y-4">
                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                              <span>Loan Progress</span>
                              <span>{getProgressPercentage(loan.amount, loan.remainingAmount)}% paid</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${getProgressPercentage(loan.amount, loan.remainingAmount)}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Next Payment */}
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium text-sm text-blue-700 dark:text-blue-300">Next Installment</span>
                              </div>
                              <span className="text-blue-800 dark:text-blue-200 font-semibold">₹{loan.nextInstallmentAmount.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span>
                            </div>
                            <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                              Due on {formatDate(loan.nextInstallmentDate)}
                            </div>
                          </div>
                          
                          {/* Loan Details */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">Original Amount:</span>
                              <span className="text-sm font-medium">₹{loan.amount.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">Interest Rate:</span>
                              <span className="text-sm font-medium">{loan.interestRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">Start Date:</span>
                              <span className="text-sm font-medium">{formatDate(loan.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">End Date:</span>
                              <span className="text-sm font-medium">{formatDate(loan.endDate)}</span>
                            </div>
                          </div>
                          
                          {/* Additional Details */}
                          {Object.keys(loan.additionalDetails).length > 0 && (
                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-700">
                              <h5 className="text-xs uppercase font-medium text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                Additional Details
                              </h5>
                              <div className="space-y-1">
                                {Object.entries(loan.additionalDetails).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{key}:</span>
                                    <span className="text-xs">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center text-zinc-500 dark:text-zinc-400">
              No loans found for this account
            </div>
          )}
        </>
      ) : (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center text-zinc-500 dark:text-zinc-400">
          No loan accounts available
        </div>
      )}
    </motion.div>
  );
} 