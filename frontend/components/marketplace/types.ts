import { LucideIcon } from 'lucide-react';

export type Strategy = {
  id: string;
  agent_id: string; // backend id
  creator: string;
  title: string;
  summary: string;
  description: string;
  happiness: number;
  users: number;
  profitUsers: number;
  avgStopLoss: number;
  avgGains: number;
  successRate: number;
  monthlyFee: number;
  code?: string;
  agentverse_id?: string;
};

export type DeploymentData = {
  budget: string;
  stopLoss: string;
};

export type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  colorClassName: string;
};
