export interface Transaction {
    amount: number;
    date: string;
    id: number;
    receiver_account: string;
    sender_account: string;
}

export interface Account {
  id: number;
  userId: number;
  type: string;
  balance: number;
  limit: number;
  riskLevel: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  status: number;
}