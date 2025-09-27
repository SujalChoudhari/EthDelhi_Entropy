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

export async function generateTradingStrategy(description: string) {
  const { object: strategyData } = await generateObject({
    model: geminiFlashModel,
    prompt: `Based on this trading strategy description: "${description}"
    
    Generate a complete Python trading strategy using the ASI uAgent framework. The strategy should:
    1. It should be without comments and clean.
    2. Include proper error handling and risk management
    3. Use realistic trading logic based on the description
    4. Follow Python best practices
    5. Include imports for common trading libraries (pandas, numpy, etc.)
    6. Have clear entry and exit signals
    
    Make the code professional and deployable on a decentralized trading platform.`,
    schema: z.object({
      title: z.string().describe("A clear, concise title for the strategy"),
      description: z.string().describe("A refined description of what the strategy does"),
      riskLevel: z.enum(["Low", "Medium", "High"]).describe("Risk level assessment of the strategy"),
      complexity: z.enum(["Beginner", "Intermediate", "Advanced"]).describe("Technical complexity level"),
      pythonCode: z.string().describe("Complete Python code for the trading strategy"),
      estimatedGas: z.number().describe("Estimated gas cost for deployment (realistic estimate)"),
      keyFeatures: z.array(z.string()).describe("Key features and highlights of the strategy"),
      recommendedCapital: z.number().describe("Recommended minimum capital in USD"),
    }),
  });

  return strategyData;
}
