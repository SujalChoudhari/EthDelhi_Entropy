"use client";

import { useState } from "react";
import { StrategyRecommender } from "@/components/strategy/strategy-recommender";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, User, TestTube } from "lucide-react";

export default function StrategyRecommenderPage() {
  const [testMode, setTestMode] = useState<"manual" | "ai" | null>(null);

  const handleInvest = (strategyId: string) => {
    console.log(`Investing in strategy: ${strategyId}`);
    alert(`Investment initiated for strategy: ${strategyId}`);
    // This will be integrated with your payment/investment system later
  };

  // Sample AI-generated data for testing
  const sampleAIData = {
    userProfile: {
      user_id: "user_123",
      profile: "Moderate",
      asset_class: "LargeCapCrypto", 
      time_horizon: "Medium-term",
      liquidity: "High",
      experience: "Intermediate",
      interest: "RSI",
      excludes: []
    },
    explanation: "Based on your moderate risk tolerance and interest in large-cap cryptocurrencies, I've generated a profile that matches intermediate-level traders seeking medium-term opportunities.",
    title: "AI-Generated Strategy Recommendations"
  };

  if (!testMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Strategy Recommender Demo</h1>
            <p className="text-muted-foreground">
              Test the strategy recommendation system in different modes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setTestMode("manual")}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Manual Profile Entry</CardTitle>
                    <CardDescription>Fill out your own trading profile manually</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Fill risk profile, asset preferences</li>
                  <li>• Choose time horizon and experience level</li>
                  <li>• Get personalized recommendations</li>
                  <li>• Select and invest in strategies</li>
                </ul>
                <Separator className="my-4" />
                <Badge variant="secondary">Interactive Form</Badge>
              </CardContent>
            </Card>

            {/* AI Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setTestMode("ai")}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>AI Chat Integration</CardTitle>
                    <CardDescription>Simulate AI-generated profile from chat</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Pre-filled profile from AI analysis</li>
                  <li>• Automatic recommendation fetching</li>
                  <li>• Simulates chat tool call response</li>
                  <li>• Shows end-to-end integration</li>
                </ul>
                <Separator className="my-4" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">AI-Powered</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <TestTube className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium">Testing Instructions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium mb-2">Backend Requirements:</p>
                <ul className="space-y-1">
                  <li>• FastAPI server running on port 8000</li>
                  <li>• HyperOn MeTTa logic engine installed</li>
                  <li>• /recommend/recommend endpoint active</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Expected Parameters:</p>
                <ul className="space-y-1">
                  <li>• profile, asset_class, time_horizon</li>
                  <li>• liquidity, experience, interest</li>
                  <li>• user_id, excludes (optional)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {testMode === "ai" ? "AI-Generated" : "Manual"} Strategy Recommendations
            </h1>
            <p className="text-muted-foreground">
              {testMode === "ai" 
                ? "Recommendations based on AI analysis of your query" 
                : "Fill out your profile to get personalized recommendations"
              }
            </p>
          </div>
          <Button variant="outline" onClick={() => setTestMode(null)}>
            ← Back to Demo Menu
          </Button>
        </div>
        
        <StrategyRecommender 
          onInvest={handleInvest}
          recommendationData={testMode === "ai" ? sampleAIData : undefined}
        />
      </div>
    </div>
  );
}