import React from 'react';
import { Users, TrendingUp, Code, Link } from 'lucide-react';
import { Strategy } from './types';
import { Badge } from '../ui/badge';


interface StrategyCardProps {
  strategy: Strategy;
  onSelect: (strategy: Strategy) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect }) => {
  const isIndicator = strategy.type === 'indicator';
  
  return (
    <div
      className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border"
      onClick={() => onSelect(strategy)}
      data-agent-id={strategy.agent_id}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isIndicator ? (
                <TrendingUp className="h-5 w-5 text-blue-500" />
              ) : (
                <Code className="h-5 w-5 text-purple-500" />
              )}
              <h3 className="text-lg font-semibold text-card-foreground">
                {strategy.title || strategy.name || `Untitled ${isIndicator ? 'Indicator' : 'Strategy'}`}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-xs ${isIndicator ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200'}`}>
                {strategy.type || (isIndicator ? 'Indicator' : 'Strategy')}
              </Badge>
              
              {!isIndicator && (
                <Badge variant="secondary" className="text-xs">
                  {strategy.risk || 'Moderate'}
                </Badge>
              )}
              
              {strategy.isNew && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  New
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="font-medium">{strategy.reputation?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">by {strategy.creator || 'Unknown'}</p>
        
        {strategy.summary && (
          <p className="text-card-foreground mb-4 line-clamp-2 text-sm">{strategy.summary}</p>
        )}
        
        {/* Different content based on type */}
        {isIndicator ? (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Calculation:</span> {strategy.description?.split('.')[0] || 'Technical Analysis'}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Output:</span> OHLCV Data
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Asset:</span> {strategy.assetClass || 'Mixed'}
            </div>
            <div className="flex items-center text-primary">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{strategy.perf?.toFixed(1) || '0.0'}%</span>
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {isIndicator ? 'Type: Technical Indicator' : `Time: ${strategy.time || 'Medium-term'}`}
            </span>
            {!isIndicator && strategy.type === 'strategy' && (
              <div className="flex items-center">
                <Link className="h-3 w-3 mr-1" />
                <span>Uses Indicators</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard;
