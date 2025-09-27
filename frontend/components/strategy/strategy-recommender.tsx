"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  TrendingUp, 
  Star, 
  DollarSign, 
  Clock, 
  Target, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Filter,
  ArrowRight,
  Zap,
  Shield,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  user_id: string;
  profile: string;
  asset_class: string;
  time_horizon: string;
  liquidity: string;
  experience: string;
  interest: string;
  excludes?: string[];
}

interface StrategyRecommendation {
  strategy: string;
  score: number;
}

interface RecommendationResponse {
  recommendations: StrategyRecommendation[];
}

interface StrategyRecommenderProps {
  onInvest?: (strategyId: string) => void;
  recommendationData?: {
    userProfile: UserProfile;
    explanation: string;
    title: string;
  };
}

const STRATEGY_DETAILS = {
  "s1": {
    name: "Large Cap Crypto Momentum",
    description: "Moderate risk strategy focused on major cryptocurrencies using RSI signals",
    riskLevel: "Moderate",
    assetClass: "Large Cap Crypto",
    timeHorizon: "Medium-term",
    indicator: "RSI",
    performance: "1.5x",
    reputation: 0.9,
    isNew: true,
    monthlyFee: "$50",
    minInvestment: "$1,000"
  },
  "s2": {
    name: "Mid Cap Crypto Scalping",
    description: "Aggressive short-term trading on mid-cap cryptocurrencies with MACD",
    riskLevel: "Aggressive",
    assetClass: "Mid Cap Crypto",
    timeHorizon: "Short-term",
    indicator: "MACD",
    performance: "2.0x",
    reputation: 0.8,
    isNew: false,
    monthlyFee: "$75",
    minInvestment: "$500"
  },
  "s3": {
    name: "Stablecoin Yield Strategy",
    description: "Conservative approach with stablecoins using VWAP for optimal entry",
    riskLevel: "Conservative",
    assetClass: "Stablecoins",
    timeHorizon: "Long-term",
    indicator: "VWAP",
    performance: "1.0x",
    reputation: 0.95,
    isNew: true,
    monthlyFee: "$25",
    minInvestment: "$2,000"
  },
  "s4": {
    name: "DeFi Degen Hunter",
    description: "High-risk DeFi protocol hunting using Stochastic oscillator",
    riskLevel: "High-Degenerate",
    assetClass: "DeFi",
    timeHorizon: "Short-term",
    indicator: "Stochastic",
    performance: "3.0x",
    reputation: 0.7,
    isNew: true,
    monthlyFee: "$100",
    minInvestment: "$250"
  },
  "s5": {
    name: "NFT Market Maker",
    description: "Moderate risk NFT trading strategy with MACD confirmation",
    riskLevel: "Moderate",
    assetClass: "NFTs",
    timeHorizon: "Medium-term",
    indicator: "MACD",
    performance: "1.2x",
    reputation: 0.85,
    isNew: false,
    monthlyFee: "$60",
    minInvestment: "$750"
  },
  "s6": {
    name: "Bear Market Crusher",
    description: "Aggressive strategy for bearish conditions on large cap crypto",
    riskLevel: "Aggressive",
    assetClass: "Large Cap Crypto",
    timeHorizon: "Medium-term",
    indicator: "RSI",
    performance: "2.5x",
    reputation: 0.95,
    isNew: true,
    monthlyFee: "$85",
    minInvestment: "$1,500"
  }
};

const getRiskColor = (risk: string) => {
  switch (risk.toLowerCase()) {
    case "conservative": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "moderate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "aggressive": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "high-degenerate": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getRiskIcon = (risk: string) => {
  switch (risk.toLowerCase()) {
    case "conservative": return <Shield className="h-4 w-4" />;
    case "moderate": return <Target className="h-4 w-4" />;
    case "aggressive": return <TrendingUp className="h-4 w-4" />;
    case "high-degenerate": return <Zap className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

export function StrategyRecommender({ onInvest, recommendationData }: StrategyRecommenderProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>(
    recommendationData?.userProfile 
      ? { ...recommendationData.userProfile, user_id: "user_123" }
      : {
          user_id: "user_123",
          profile: "",
          asset_class: "",
          time_horizon: "",
          liquidity: "High",
          experience: "Intermediate",
          interest: "",
          excludes: []
        }
  );
  
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(!recommendationData);

  // Auto-fetch recommendations if AI provided the profile
  useEffect(() => {
    if (recommendationData && recommendationData.userProfile) {
      handleGetRecommendations();
    }
  }, [recommendationData]);

  const handleGetRecommendations = async () => {
    // Set default values for non-scoring fields
    const profileWithDefaults = {
      ...userProfile,
      liquidity: userProfile.liquidity || "High",
      experience: userProfile.experience || "Intermediate"
    };
    
    // Validate required fields (only the ones that affect scoring)
    const requiredFields = ['profile', 'asset_class', 'time_horizon', 'interest'];
    const missingFields = requiredFields.filter(field => !profileWithDefaults[field as keyof UserProfile]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/recommend/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileWithDefaults),
      });

      if (response.ok) {
        const result: RecommendationResponse = await response.json();
        setRecommendations(result.recommendations);
        setShowForm(false);
        toast.success(`Found ${result.recommendations.length} recommended strategies!`);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Failed to get recommendations');
      }
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to backend. Please ensure the FastAPI server is running on port 8000.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Failed to get recommendations: ${errorMessage}`);
      console.error('Recommendation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStrategySelection = (strategyId: string) => {
    const newSelection = new Set(selectedStrategies);
    if (newSelection.has(strategyId)) {
      newSelection.delete(strategyId);
    } else {
      newSelection.add(strategyId);
    }
    setSelectedStrategies(newSelection);
  };

  const handleInvestSelected = () => {
    if (selectedStrategies.size === 0) {
      toast.error("Please select at least one strategy to invest in");
      return;
    }
    
    // Calculate total investment
    const totalFee = Array.from(selectedStrategies).reduce((sum, strategyId) => {
      const details = STRATEGY_DETAILS[strategyId as keyof typeof STRATEGY_DETAILS];
      return sum + parseInt(details?.monthlyFee.replace('$', '') || '0');
    }, 0);
    
    toast.success(`Selected ${selectedStrategies.size} strategies. Total monthly fee: $${totalFee}`);
    
    // Call parent callback if provided
    if (onInvest) {
      selectedStrategies.forEach(strategy => onInvest(strategy));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-2 border-dashed border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl font-bold">
                {recommendationData?.title || "Strategy Recommender"}
              </CardTitle>
              <CardDescription>
                {recommendationData?.explanation || "Get personalized trading strategy recommendations based on your profile"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* User Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile">Risk Profile *</Label>
                    <Select
                      onValueChange={(value) => setUserProfile({...userProfile, profile: value})}
                      value={userProfile.profile}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conservative">Conservative</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Aggressive">Aggressive</SelectItem>
                        <SelectItem value="High-Degenerate">High-Degenerate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asset_class">Preferred Asset Class *</Label>
                    <Select
                      onValueChange={(value) => setUserProfile({...userProfile, asset_class: value})}
                      value={userProfile.asset_class}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LargeCapCrypto">Large Cap Crypto</SelectItem>
                        <SelectItem value="MidCapCrypto">Mid Cap Crypto</SelectItem>
                        <SelectItem value="Stablecoins">Stablecoins</SelectItem>
                        <SelectItem value="DeFi">DeFi</SelectItem>
                        <SelectItem value="NFTs">NFTs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time_horizon">Time Horizon *</Label>
                    <Select
                      onValueChange={(value) => setUserProfile({...userProfile, time_horizon: value})}
                      value={userProfile.time_horizon}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time horizon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short-term">Short-term (Days)</SelectItem>
                        <SelectItem value="Medium-term">Medium-term (Weeks)</SelectItem>
                        <SelectItem value="Long-term">Long-term (Months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>



                  <div className="space-y-2">
                    <Label htmlFor="interest">Technical Indicator Interest *</Label>
                    <Select
                      onValueChange={(value) => setUserProfile({...userProfile, interest: value})}
                      value={userProfile.interest}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RSI">RSI</SelectItem>
                        <SelectItem value="MACD">MACD</SelectItem>
                        <SelectItem value="VWAP">VWAP</SelectItem>
                        <SelectItem value="Stochastic">Stochastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleGetRecommendations}
                  disabled={isLoading}
                  className="w-full h-12 text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <Filter className="mr-2 h-5 w-5" />
                      Get Strategy Recommendations
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {!showForm && recommendations.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Recommended Strategies</h3>
                    <p className="text-sm text-muted-foreground">
                      Found {recommendations.length} strategies matching your profile
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(true)}
                    className="text-sm"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </div>

                {/* Strategies List */}
                <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => {
                      const details = STRATEGY_DETAILS[rec.strategy as keyof typeof STRATEGY_DETAILS];
                      if (!details) return null;
                      
                      const isSelected = selectedStrategies.has(rec.strategy);
                      
                      return (
                        <motion.div
                          key={rec.strategy}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              isSelected 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : 'hover:bg-secondary/50'
                            }`}
                            onClick={() => toggleStrategySelection(rec.strategy)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-2">
                                    {getRiskIcon(details.riskLevel)}
                                    <div>
                                      <CardTitle className="text-lg font-bold">
                                        {details.name}
                                      </CardTitle>
                                      <CardDescription className="text-sm">
                                        {details.description}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="font-mono">
                                    Score: {rec.score}
                                  </Badge>
                                  {isSelected && (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Risk Level</p>
                                  <Badge className={getRiskColor(details.riskLevel)} variant="secondary">
                                    {details.riskLevel}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Performance</p>
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-sm font-medium">{details.performance}</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Monthly Fee</p>
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="h-3 w-3 text-blue-500" />
                                    <span className="text-sm font-medium">{details.monthlyFee}</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Min Investment</p>
                                  <div className="flex items-center space-x-1">
                                    <Target className="h-3 w-3 text-purple-500" />
                                    <span className="text-sm font-medium">{details.minInvestment}</span>
                                  </div>
                                </div>
                              </div>

                              <Separator className="my-3" />

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center space-x-4">
                                  <span>Asset: {details.assetClass}</span>
                                  <span>Horizon: {details.timeHorizon}</span>
                                  <span>Indicator: {details.indicator}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {details.isNew && (
                                    <Badge variant="outline" className="text-xs">New</Badge>
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{details.reputation}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Action Buttons */}
                {selectedStrategies.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg border"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {selectedStrategies.size} strategies selected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total monthly fees: $
                        {Array.from(selectedStrategies).reduce((sum, strategyId) => {
                          const details = STRATEGY_DETAILS[strategyId as keyof typeof STRATEGY_DETAILS];
                          return sum + parseInt(details?.monthlyFee.replace('$', '') || '0');
                        }, 0)}
                      </p>
                    </div>
                    <Button
                      onClick={handleInvestSelected}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Invest in Selected
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
