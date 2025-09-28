import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";



export async function saveChatToLocalStorage(chat: any) {
  return chat;
}

export async function generateSampleAccountBalance() {
  const { object: accountBalance } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate a realistic bank account balance with checking, savings, and credit card information`,
    schema: z.object({
      checking: z.object({
        balance: z.number().describe("Current balance in INR"),
        accountNumber: z.string().describe("Last 4 digits of account number"),
        availableBalance: z.number().describe("Available balance in INR"),
      }),
      savings: z.object({
        balance: z.number().describe("Current balance in INR"),
        accountNumber: z.string().describe("Last 4 digits of account number"),
        interestRate: z.number().describe("Annual interest rate percentage"),
      }),
      creditCard: z.object({
        balance: z.number().describe("Current balance in INR"),
        availableCredit: z.number().describe("Available credit in INR"),
        dueDate: z.string().describe("Payment due date in MM/DD/YYYY format"),
        lastFourDigits: z.string().describe("Last 4 digits of card"),
      }),
      lastUpdated: z.string().describe("Timestamp of when balance was last updated"),
    }),
  });

  return accountBalance;
}

export async function generateAccountOptions() {
  return [
    { id: "checking", label: "Checking (••••3456)", balance: 2458.32 },
    { id: "savings", label: "Savings (••••8901)", balance: 12547.65 },
    { id: "credit", label: "Credit Card (••••5678)", balance: 5000.00 }
  ];
}

export async function generateStrategyRecommendations(userQuery: string, chatHistory?: any[]) {
  const { object: recommendationData } = await generateObject({
    model: geminiFlashModel,
    prompt: `
      You are analyzing a user's request for trading strategy recommendations. The user is a LAYMAN who won't explicitly state their risk tolerance or experience level.

      User Query: "${userQuery}"
      ${chatHistory && chatHistory.length > 0 ? `
      Previous Chat Context: ${JSON.stringify(chatHistory.slice(-10))} // Last 10 messages for behavioral analysis
      ` : 'Chat History: This appears to be a new user or first interaction'}

      BEHAVIORAL ANALYSIS INSTRUCTIONS:
      
      🧠 UNCONSCIOUS PROFILING - Infer user characteristics from:
      - Language used (casual = beginner, technical = advanced)
      - Questions asked (basic concepts = conservative, complex strategies = aggressive)
      - Previous strategy interests mentioned
      - Risk words used ("safe", "stable" = conservative | "moon", "gains", "fast" = aggressive)
      - Time mentions ("long term", "retirement" = conservative | "quick", "day trading" = aggressive)
      
      📊 DEFAULT RECOMMENDATIONS (for new/unclear users):
      - Start with "Moderate" risk profile for safety
      - Prefer "LargeCapCrypto" as it's most familiar to laymen  
      - Default to "Medium-term" horizon (weeks to months)
      - Assume "Beginner" experience unless proven otherwise
      - Use "High" liquidity preference for safety
      - Start with "RSI" indicator as it's simple to understand

      🎯 BEHAVIORAL CUES TO WATCH FOR:
      - Mentions of "Bitcoin", "Ethereum" = LargeCapCrypto preference
      - Words like "safe", "stable", "secure" = Conservative profile
      - Words like "profit", "gains", "opportunity" = Moderate profile  
      - Words like "moon", "degen", "yolo", "risky" = Aggressive profile
      - Mentions of "DeFi", "yield farming", "protocols" = DeFi preference
      - Questions about basics = Beginner experience
      - Technical analysis mentions = Intermediate+ experience
      
      🔍 INFERENCE RULES:
      1. If user is new/unclear -> Use moderate defaults with conservative bias
      2. If user shows risk appetite -> Gradually increase risk profile
      3. If user mentions specific coins -> Match asset class accordingly
      4. If user asks about "quick profits" -> Short-term horizon
      5. If user asks about "building wealth" -> Long-term horizon
      
      Generate a profile that feels natural and doesn't expose our analysis process.
    `,
    schema: z.object({
      userProfile: z.object({
        profile: z.enum(["Conservative", "Moderate", "Aggressive", "High-Degenerate"])
          .describe("Risk profile inferred from behavioral analysis"),
        asset_class: z.enum(["LargeCapCrypto", "MidCapCrypto", "Stablecoins", "DeFi", "NFTs"])
          .describe("Asset preference based on user's language and context"),
        time_horizon: z.enum(["Short-term", "Medium-term", "Long-term"])
          .describe("Investment horizon inferred from user's goals and language"),
        liquidity: z.enum(["High", "Medium", "Low"])
          .describe("Liquidity need based on user's risk profile and experience"),
        experience: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"])
          .describe("Experience level inferred from technical language and questions"),
        interest: z.enum(["RSI", "MACD", "VWAP", "Stochastic"])
          .describe("Technical indicator suited to their inferred experience level"),
      }),
      explanation: z.string()
        .describe("Natural explanation without revealing the profiling process - focus on strategy benefits"),
      title: z.string()
        .describe("Engaging title that matches their request style"),
      confidenceLevel: z.enum(["Low", "Medium", "High"])
        .describe("How confident we are in our behavioral analysis"),
      inferredTraits: z.array(z.string())
        .describe("Key behavioral traits detected (for internal tracking)"),
    }),
  });

  return recommendationData;
}



export async function generateAppointmentDetails(subject: string, context?: string) {
  const { object: appointmentDetails } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate detailed information for a bank appointment with the subject "${subject}".
    ${context ? `Additional context from user query: ${context}` : ''}
    
    The message should be in first person as if the customer is speaking, describing what they want to discuss in the appointment.
    The message should be specific to the appointment subject.
    Include relevant information about what the user might want to know or discuss in this appointment.`,
    schema: z.object({
      subject: z.string().describe("Refined appointment subject"),
      message: z.string().describe("Detailed message for the appointment request in first person"),
      suggestedBranch: z.string().optional().describe("Suggested branch name if mentioned")
    }),
  });

  return appointmentDetails;
}

export async function generateIndicator(description: string) {
  const { object: indicatorData } = await generateObject({
    model: geminiFlashModel,
    prompt: `Based on this indicator description: "${description}"
    
    Generate a complete Python indicator using the uAgent framework. The indicator should:
    1. Calculate technical analysis data (moving averages, RSI, MACD, Bollinger Bands, etc.)
    2. Use @inject_selected decorator if it needs to consume data from other indicators
    3. Always call push(open, high, low, close, volume) to store calculated OHLCV data
    4. Include proper error handling and mathematical calculations
    5. Be clean code without comments
    6. Focus on data calculation and storage, NOT trading decisions
    7. Include @agent.on_event("startup") handler for initialization
    
    IMPORTANT: Indicators are building blocks that calculate and store data. They should:
    - Calculate technical indicators (MA, RSI, MACD, etc.)
    - Call push(open, high, low, close, volume) with calculated values
    - NOT include swap() calls (those are for strategies)
    - Store results in standardized OHLCV format for strategies to consume
    
    Available function: push(open, high, low, close, volume) - stores data to PubSub database
    
    Example structure:
    @agent.on_event("startup")
    async def startup(ctx: Context):
        # Calculate indicator values
        # Call push(open, high, low, close, volume)
    `,
    schema: z.object({
      title: z.string().describe("Clear title for the indicator (e.g., 'Moving Average Crossover', 'RSI Oscillator')"),
      description: z.string().describe("What the indicator calculates and measures"),
      indicatorType: z.enum(["Trend", "Momentum", "Volume", "Volatility"]).describe("Category of technical analysis"),
      complexity: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("Calculation complexity level"),
      pythonCode: z.string().describe("Complete Python code for the indicator with push() calls"),
      outputDescription: z.string().describe("Description of what OHLCV data this indicator produces"),
      keyFeatures: z.array(z.string()).describe("Key technical features and calculations"),
      dependencies: z.array(z.string()).describe("Names of other indicators this depends on (if any)"),
    }),
  });

  return indicatorData;
}

export async function generateTradingStrategy(description: string, availableIndicators: string[] = []) {
  const { object: strategyData } = await generateObject({
    model: geminiFlashModel,
    prompt: `Based on this trading strategy description: "${description}"
    
    Available indicators to inject: ${availableIndicators.length > 0 ? availableIndicators.join(", ") : "None available"}
    
    Generate a complete Python trading strategy using the uAgent framework. The strategy should:
    1. Use @inject_selected(["indicator1", "indicator2"]) to consume data from indicators
    2. Include swap(fromCrypto, toCrypto, wallet_address, amount) function calls for trading execution
    3. Make trading decisions based on injected indicator data
    4. Include proper error handling and risk management
    5. Be clean code without comments
    6. Focus on trading logic, NOT data calculation (indicators handle that)
    7. Include @agent.on_event("startup") handler for strategy logic
    
    IMPORTANT: Strategies consume indicator data and execute trades. They should:
    - Use @inject_selected to get data from indicators
    - Call swap(fromCrypto, toCrypto, wallet_address, amount) for trades
    - NOT calculate indicators (use injected functions instead)
    - Make decisions based on indicator signals
    
    Available function: swap(fromCrypto, toCrypto, wallet_address, amount) - executes crypto swaps
    
    Example structure:
    @inject_selected(["ma_crossover", "rsi_signal"])
    @agent.on_event("startup") 
    async def strategy_logic(ctx: Context, ma_crossover, rsi_signal):
        # Get indicator data
        ma_data = ma_crossover()
        rsi_data = rsi_signal()
        # Make trading decisions
        if condition:
            swap("USDT", "BTC", wallet_address, 100)
        elif other_condition:
            swap("BTC", "USDT", wallet_address, 0.01)
    `,
    schema: z.object({
      title: z.string().describe("A clear, concise title for the strategy"),
      description: z.string().describe("A refined description of what the strategy does"),
      riskLevel: z.enum(["Low", "Medium", "High"]).describe("Risk level assessment of the strategy"),
      complexity: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("Technical complexity level"),
      pythonCode: z.string().describe("Complete Python code for the trading strategy with @inject_selected"),
      estimatedGas: z.number().describe("Estimated gas cost for deployment (realistic estimate)"),
      keyFeatures: z.array(z.string()).describe("Key features and highlights of the strategy"),
      recommendedCapital: z.number().describe("Recommended minimum capital in USD"),
      requiredIndicators: z.array(z.string()).describe("Names of indicators this strategy depends on"),
      tradingSignals: z.array(z.string()).describe("Key trading signals the strategy responds to"),
    }),
  });

  return strategyData;
}
