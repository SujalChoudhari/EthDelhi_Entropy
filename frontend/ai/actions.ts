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

export async function generateStrategyRecommendations(userQuery: string) {
  const { object: recommendationData } = await generateObject({
    model: geminiFlashModel,
    prompt: `
      Based on the user query: "${userQuery}"
      
      Generate a user profile and explanation for trading strategy recommendations.
      The user is asking for strategy recommendations, so create a realistic profile 
      that matches their request. Consider their risk tolerance, experience level,
      and preferences mentioned in the query.
    `,
    schema: z.object({
      userProfile: z.object({
        profile: z.enum(["Conservative", "Moderate", "Aggressive", "High-Degenerate"])
          .describe("Risk profile based on user query"),
        asset_class: z.enum(["LargeCapCrypto", "MidCapCrypto", "Stablecoins", "DeFi", "NFTs"])
          .describe("Preferred asset class"),
        time_horizon: z.enum(["Short-term", "Medium-term", "Long-term"])
          .describe("Investment time horizon"),
        liquidity: z.enum(["High", "Medium", "Low"])
          .describe("Liquidity preference"),
        experience: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"])
          .describe("Trading experience level"),
        interest: z.enum(["RSI", "MACD", "VWAP", "Stochastic"])
          .describe("Technical indicator preference"),
      }),
      explanation: z.string()
        .describe("Brief explanation of why this profile was selected based on the user's query"),
      title: z.string()
        .describe("A catchy title for the recommendation request"),
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
