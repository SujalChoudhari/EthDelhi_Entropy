import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { Strategy } from './types';


interface StrategyCardProps {
  strategy: Strategy;
  onSelect: (strategy: Strategy) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect }) => (
  <div
    className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border"
    onClick={() => onSelect(strategy)}
    data-agent-id={strategy.agent_id}
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{strategy.title || strategy.name || 'Untitled Strategy'}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${strategy.isNew ? '' : ''}`}>
              {strategy.isNew ? 'New' : 'Established'}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
              {strategy.risk || 'Moderate'}
            </span>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="font-medium">{strategy.reputation?.toFixed(1) || '0.0'}</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-2">by {strategy.creator || 'Unknown'}</p>
      
      {strategy.summary && (
        <p className="text-card-foreground mb-4 line-clamp-2">{strategy.summary}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Asset:</span> {strategy.assetClass || 'Mixed'}
        </div>
        <div className="flex items-center text-primary">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{strategy.perf?.toFixed(1) || '0.0'}%</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Time: {strategy.time || 'Medium-term'}</span>
          <span className="capitalize">{strategy.type || 'Strategy'}</span>
        </div>
      </div>
    </div>
  </div>
);

export default StrategyCard;
