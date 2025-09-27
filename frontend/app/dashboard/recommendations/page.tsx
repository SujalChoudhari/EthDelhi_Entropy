"use client";

import { StrategyRecommender } from "@/components/strategy/strategy-recommender";

export default function StrategyRecommenderPage() {
  const handleInvest = (strategyId: string) => {
    console.log(`Investing in strategy: ${strategyId}`);
    // This will be integrated with your payment/investment system later
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Strategy Recommendations</h1>
          <p className="text-muted-foreground">
            Discover personalized trading strategies powered by AI and user preferences
          </p>
        </div>
        
        <StrategyRecommender onInvest={handleInvest} />
      </div>
    </div>
  );
}