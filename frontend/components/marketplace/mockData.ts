import { Strategy } from './types';

export const mockStrategies: Strategy[] = [
  {
    id: 1,
    creator: "CryptoMaster",
    title: "DCA Bull Run Pro",
    summary: "Dollar-cost averaging strategy optimized for bull markets",
    description: "This strategy implements a sophisticated dollar-cost averaging approach that identifies optimal entry points during bull market conditions. It uses multiple technical indicators and market sentiment analysis to maximize returns while minimizing risk exposure.",
    happiness: 344,
    users: 1247,
    profitUsers: 892,
    avgStopLoss: 15,
    avgGains: 23.5,
    successRate: 71.6,
    monthlyFee: 0.05
  },
  {
    id: 2,
    creator: "TechAnalyst99",
    title: "RSI Momentum Scalp",
    summary: "High-frequency scalping using RSI and volume indicators",
    description: "Advanced scalping strategy that leverages RSI overbought/oversold conditions combined with volume analysis. Perfect for traders who want to capture small but consistent profits throughout the day.",
    happiness: 289,
    users: 823,
    profitUsers: 567,
    avgStopLoss: 8,
    avgGains: 12.3,
    successRate: 68.9,
    monthlyFee: 0.08
  },
  {
    id: 3,
    creator: "WhaleWatcher",
    title: "Smart Money Follow",
    summary: "Tracks whale movements and institutional buying patterns",
    description: "This strategy monitors large wallet movements and institutional trading patterns to predict market direction. It's designed to ride the waves created by smart money entering and exiting positions.",
    happiness: 412,
    users: 2156,
    profitUsers: 1523,
    avgStopLoss: 12,
    avgGains: 28.7,
    successRate: 70.6,
    monthlyFee: 0.12
  },
  {
    id: 4,
    creator: "GridMaster",
    title: "AI Grid Trading Bot",
    summary: "Automated grid trading with machine learning optimization",
    description: "State-of-the-art grid trading system powered by machine learning algorithms. Automatically adjusts grid parameters based on market volatility and historical performance data.",
    happiness: 156,
    users: 445,
    profitUsers: 298,
    avgStopLoss: 20,
    avgGains: 18.9,
    successRate: 66.9,
    monthlyFee: 0.15
  },
  {
    id: 5,
    creator: "MoonHunter",
    title: "Breakout Scanner Pro",
    summary: "Identifies and capitalizes on major breakout patterns",
    description: "Sophisticated pattern recognition system that identifies potential breakout scenarios across multiple timeframes. Uses advanced technical analysis to enter positions before major price movements.",
    happiness: 523,
    users: 1834,
    profitUsers: 1289,
    avgStopLoss: 10,
    avgGains: 31.2,
    successRate: 70.3,
    monthlyFee: 0.09
  },
  {
    id: 6,
    creator: "SafeTrader",
    title: "Conservative Growth",
    summary: "Low-risk strategy focused on steady, consistent returns",
    description: "Perfect for risk-averse traders who prefer steady growth over high volatility. This strategy focuses on blue-chip cryptocurrencies and uses conservative position sizing with strict risk management.",
    happiness: 278,
    users: 967,
    profitUsers: 734,
    avgStopLoss: 5,
    avgGains: 8.4,
    successRate: 75.9,
    monthlyFee: 0.04
  }
];
