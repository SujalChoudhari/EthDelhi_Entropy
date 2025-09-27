"use client";

import React, { useState, useEffect } from 'react';
import { Strategy, DeploymentData } from './types';
import { Users, TrendingUp, DollarSign, Shield, Zap } from 'lucide-react';
import StatCard from './StatCard';
import { updateHappiness } from './api';

interface StrategyModalProps {
  strategy: Strategy | null;
  onClose: () => void;
}

const StrategyModal: React.FC<StrategyModalProps> = ({ strategy, onClose }) => {
  const [deploymentData, setDeploymentData] = useState<DeploymentData>({ budget: '', stopLoss: '' });
  const [userHappiness, setUserHappiness] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);

  useEffect(() => {
    if (strategy) {
      setDeploymentData({ budget: '', stopLoss: '' });
      setUserHappiness(0);
      setHasRated(false);
    }
  }, [strategy]);

  if (!strategy) return null;

  const handleUseStrategy = () => {
    alert(`Strategy "${strategy.title}" deployed successfully!\nBudget: ${deploymentData.budget}\nStop Loss: ${deploymentData.stopLoss}%`);
    onClose();
  };

  const handleHappinessRating = async (rating: number) => {
    setUserHappiness(rating);
    setHasRated(true);
    if (strategy && (strategy.agent_id || strategy.id)) {
      try {
        await updateHappiness(strategy.agent_id || strategy.id, rating);
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[--color-card] rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b border-[--color-border]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-[--color-primary]">{strategy.title}</h2>
              <p className="text-[--color-muted-foreground]">by {strategy.creator}</p>
            </div>
            <button onClick={onClose} className="text-[--color-muted-foreground] hover:text-[--color-primary] text-xl">
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-[--color-foreground] mb-4">{strategy.summary}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-[--color-foreground]">{strategy.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Users} label="Active Users" value={strategy.users} colorClassName="text-[--color-primary]" />
            <StatCard icon={TrendingUp} label="Profitable Users" value={strategy.profitUsers} colorClassName="text-[--color-secondary]" />
            <StatCard icon={DollarSign} label="Avg. Gains" value={`${strategy.avgGains}%`} colorClassName="text-[--color-primary]" />
            <StatCard icon={Shield} label="Avg. Stop Loss" value={`${strategy.avgStopLoss}%`} colorClassName="text-[--color-secondary]" />
          </div>

          <div className="mb-6 p-4 bg-[--color-primary]/10 rounded-lg">
             <div className="flex justify-between items-center mb-2">
               <span className="text-[--color-foreground]">Success Rate:</span>
               <span className="font-semibold text-[--color-primary]">{strategy.successRate}%</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-[--color-foreground]">Monthly Fee:</span>
               <span className="font-semibold text-[--color-foreground]">{strategy.monthlyFee} ETH</span>
             </div>
          </div>
          
          {/* Happiness Rating */}
           <div className="p-4 border border-[--color-border] rounded-lg bg-[--color-secondary]/10">
             <h3 className="text-lg font-semibold mb-3 text-center">Rate Your Experience</h3>
             <div className="flex justify-center items-center space-x-4 mb-2">
               {[1, 2, 3, 4, 5].map((rating) => (
                 <button
                   key={rating}
                   onClick={() => handleHappinessRating(rating)}
                   className={`text-3xl transition-transform hover:scale-110 ${
                     userHappiness >= rating ? 'opacity-100' : 'opacity-40'
                   }`}
                 >
                   {rating === 1 ? '😢' : rating === 2 ? '😕' : rating === 3 ? '😐' : rating === 4 ? '😊' : '🤩'}
                 </button>
               ))}
             </div>
             {hasRated && (
               <div className="text-sm text-center text-[--color-primary] font-medium">
                 Thanks for rating!
               </div>
             )}
           </div>
        </div>

        {/* Fixed Footer - Deployment Form */}
        <div className="flex-shrink-0 border-t border-[--color-border] p-6 bg-[--color-secondary]/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-[--color-primary]" />
            Deploy Strategy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[--color-foreground] mb-2">Investment Budget (USD)</label>
              <input
                type="number"
                placeholder="1000"
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                value={deploymentData.budget}
                onChange={(e) => setDeploymentData({...deploymentData, budget: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[--color-foreground] mb-2">Stop Loss (%)</label>
              <input
                type="number"
                placeholder={strategy.avgStopLoss.toString()}
                className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                value={deploymentData.stopLoss}
                onChange={(e) => setDeploymentData({...deploymentData, stopLoss: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUseStrategy}
              disabled={!deploymentData.budget || !deploymentData.stopLoss}
              className="flex-1 bg-[--color-primary] py-2 px-4 rounded-md hover:bg-[--color-primary]/90 disabled:bg-[--color-border] disabled:cursor-not-allowed transition-colors"
            >
              Deploy Strategy ({strategy.monthlyFee} ETH/month)
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-[--color-border] text-[--color-foreground] rounded-md hover:bg-[--color-secondary]/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyModal;
