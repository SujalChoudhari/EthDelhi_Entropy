"use client";

import React, { useState, useEffect } from 'react';
import { Strategy } from './types';
import Header from './Header';
import SearchBar from './SearchBar';
import StrategyGrid from './StrategyGrid';
import StrategyModal from './StrategyModal';
import { fetchStrategies } from './api';


const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchStrategies(searchTerm)
      .then(setStrategies)
      .catch(() => setStrategies([]))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const handleSelectStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleCloseModal = () => {
    setSelectedStrategy(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {loading ? (
          <div className="text-center py-10">Loading strategies...</div>
        ) : (
          <StrategyGrid strategies={strategies} onSelectStrategy={handleSelectStrategy} />
        )}
        <StrategyModal strategy={selectedStrategy} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default App;
