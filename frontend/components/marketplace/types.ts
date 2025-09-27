import { LucideIcon } from 'lucide-react';

export type Strategy = {
  agent_id: string; // Primary identifier
  code: string;
  agentverse_id?: string;
  
  // New strategy parameters (primary)
  risk?: string;
  assetClass?: string;
  time?: string;
  currentStateOfMarket?: string;
  interest?: string;
  perf?: number;
  isNew?: boolean;
  reputation?: number;
  
  // Old parameters (kept for compatibility)
  name?: string;
  creator?: string;
  title?: string;
  summary?: string;
  description?: string;
  type?: string;
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
