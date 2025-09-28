"use client";

import React, { useState, useEffect } from 'react';
import { Strategy } from './types';
import Header from './Header';
import SearchBar from './SearchBar';
import StrategyGrid from './StrategyGrid';
import StrategyModal from './StrategyModal';
import { fetchStrategies } from './api';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TrendingUp, Code } from 'lucide-react';


type AgentType = 'all' | 'strategy' | 'indicator';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<AgentType>('all');

  useEffect(() => {
    setLoading(true);
    fetchStrategies(searchTerm, selectedType === 'all' ? undefined : selectedType)
      .then(setStrategies)
      .catch(() => setStrategies([]))
      .finally(() => setLoading(false));
  }, [searchTerm, selectedType]);

  const handleSelectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleCloseModal = () => {
    setSelectedStrategy(null);
  };

  return (
    <div className="min-h-screen bg-background p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        {/* Type Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            className="flex items-center gap-2"
          >
            All Agents
            <Badge variant="secondary" className="ml-1">
              {strategies.length}
            </Badge>
          </Button>
          <Button
            variant={selectedType === 'strategy' ? 'default' : 'outline'}
            onClick={() => setSelectedType('strategy')}
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            Strategies
            <Badge variant="secondary" className="ml-1">
              {strategies.filter(s => s.type === 'strategy').length}
            </Badge>
          </Button>
          <Button
            variant={selectedType === 'indicator' ? 'default' : 'outline'}
            onClick={() => setSelectedType('indicator')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Indicators
            <Badge variant="secondary" className="ml-1">
              {strategies.filter(s => s.type === 'indicator').length}
            </Badge>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading {selectedType === 'all' ? 'agents' : selectedType + 's'}...</div>
        ) : (
          <StrategyGrid strategies={strategies} onSelectStrategy={handleSelectStrategy} />
        )}
        <StrategyModal strategy={selectedStrategy} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default App;
