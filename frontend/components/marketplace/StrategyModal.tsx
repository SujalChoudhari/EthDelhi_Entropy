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
    // Reset local state when a new strategy is selected or modal is closed
    if (strategy) {
      setDeploymentData({ budget: '', stopLoss: '' });
      setUserHappiness(0);
      setHasRated(false);
    }
  }, [strategy]);

  if (!strategy) return null;

  const handleUseStrategy = () => {
    // In a real app, you'd handle the deployment logic here
    alert(`Strategy "${strategy.title}" deployed successfully!\nBudget: ${deploymentData.budget}\nStop Loss: ${deploymentData.stopLoss}%`);
    onClose();
  };

  const handleHappinessRating = async (rating: number) => {
    setUserHappiness(rating);
    setHasRated(true);
    if (strategy && (strategy.agent_id || strategy.id)) {
      try {
        await updateHappiness(strategy.agent_id || strategy.id, rating);
      } catch (e) {
        // Optionally show error
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{strategy.title}</h2>
              <p className="text-gray-600">by {strategy.creator}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-700 mb-4">{strategy.summary}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{strategy.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Users} label="Active Users" value={strategy.users} colorClassName="text-blue-600" />
            <StatCard icon={TrendingUp} label="Profitable Users" value={strategy.profitUsers} colorClassName="text-green-600" />
            <StatCard icon={DollarSign} label="Avg. Gains" value={`${strategy.avgGains}%`} colorClassName="text-yellow-600" />
            <StatCard icon={Shield} label="Avg. Stop Loss" value={`${strategy.avgStopLoss}%`} colorClassName="text-red-600" />
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
             <div className="flex justify-between items-center mb-2">
               <span className="text-gray-700">Success Rate:</span>
               <span className="font-semibold text-blue-600">{strategy.successRate}%</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-700">Monthly Fee:</span>
               <span className="font-semibold text-gray-900">{strategy.monthlyFee} ETH</span>
             </div>
          </div>
          
          {/* Happiness Rating */}
           <div className="p-4 border rounded-lg bg-gray-50">
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
               <div className="text-sm text-center text-green-600 font-medium">
                 Thanks for rating!
               </div>
             )}
           </div>
        </div>

        {/* Fixed Footer - Deployment Form */}
        <div className="flex-shrink-0 border-t p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Deploy Strategy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Budget (USD)</label>
              <input
                type="number"
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={deploymentData.budget}
                onChange={(e) => setDeploymentData({...deploymentData, budget: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stop Loss (%)</label>
              <input
                type="number"
                placeholder={strategy.avgStopLoss.toString()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={deploymentData.stopLoss}
                onChange={(e) => setDeploymentData({...deploymentData, stopLoss: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUseStrategy}
              disabled={!deploymentData.budget || !deploymentData.stopLoss}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Deploy Strategy ({strategy.monthlyFee} ETH/month)
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
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

