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

  // Sample AI-generated data for testing behavioral analysis
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
    explanation: "I've analyzed your conversation patterns and identified strategies that match your comfort level with established cryptocurrencies and steady growth approach.",
    title: "Smart Recommendations Based on Your Profile",
    confidenceLevel: "High",
    inferredTraits: ["Safety-focused", "Growth-oriented", "Prefers established assets"]
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
                <p className="font-medium mb-2">Behavioral Analysis Test Phrases:</p>
                <ul className="space-y-1">
                  <li>• "Show me safe strategies" → Conservative</li>
                  <li>• "I want to make good profits" → Moderate</li>
                  <li>• "Looking for moon opportunities" → Aggressive</li>
                  <li>• "What's Bitcoin trading like?" → Beginner</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Chat Examples for Behavioral Analysis:</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700 dark:text-blue-300">
              <div>
                <p className="font-medium">Conservative Detection:</p>
                <p>"I'm looking for stable returns"</p>
                <p>"What are some safe crypto investments?"</p>
                <p>"I want to build wealth slowly"</p>
              </div>
              <div>
                <p className="font-medium">Aggressive Detection:</p>
                <p>"Show me high-yield DeFi strategies"</p>
                <p>"I want quick gains"</p>
                <p>"What's the hottest trading opportunity?"</p>
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