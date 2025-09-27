import React from 'react';
import { Strategy } from './types';
import StrategyCard from './StrategyCard';

interface StrategyGridProps {
  strategies: Strategy[];
  onSelectStrategy: (strategy: Strategy) => void;
}

const StrategyGrid: React.FC<StrategyGridProps> = ({ strategies, onSelectStrategy }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {strategies.map((strategy) => (
      <StrategyCard 
        key={strategy.agent_id} 
        strategy={strategy}
        onSelect={onSelectStrategy}
      />
    ))}
  </div>
);

export default StrategyGrid;
