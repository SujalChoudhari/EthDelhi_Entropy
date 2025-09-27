import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { Strategy } from './types';


interface StrategyCardProps {
  strategy: Strategy;
  onSelect: (strategy: Strategy) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect }) => (
  <div
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    onClick={() => onSelect(strategy)}
    data-agent-id={strategy.agent_id}
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{strategy.title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          {strategy.users}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">by {strategy.creator}</p>
      <p className="text-gray-700 mb-4 line-clamp-2">{strategy.summary}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-2">😊</span>
          <span className="text-sm font-medium text-gray-900">{strategy.happiness}</span>
          <span className="text-xs text-gray-500 ml-1">reactions</span>
        </div>
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{strategy.avgGains}%</span>
        </div>
      </div>
    </div>
  </div>
);

export default StrategyCard;
