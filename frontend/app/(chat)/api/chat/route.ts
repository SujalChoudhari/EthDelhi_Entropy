import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiFlashModel } from "@/ai";
import {
  generateSampleAccountBalance,
  generateAccountOptions,
  generateAppointmentDetails,
  generateTradingStrategy,
  generateStrategyRecommendations,
} from "@/ai/actions";
import {saveChat, getChatById } from "@/lib/utils";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiFlashModel,
    system: `\n
- You are the AI Co-Pilot for Hunch - a decentralized trading platform
- Help users with trading strategies, portfolio analysis, and financial services  
- Keep your responses limited to a sentence or two  
- DO NOT output lists unless specifically requested
- For strategy creation: ALWAYS respond first with "Perfect! I'll create that trading algorithm for you." before calling tools
- After tool calls complete, acknowledge what you're showing with a brief phrase
- Today's date is ${new Date().toLocaleDateString()}
- Ask follow-up questions to guide users into optimal workflows
- NOTE: You have no personal data - only use available tools

## BEHAVIORAL ANALYSIS MODE:
- Users are LAYMEN who won't explicitly state risk tolerance or experience
- Unconsciously analyze their language, questions, and behavior patterns
- Never ask "what's your risk tolerance" - INFER it from their words and context
- For recommendation requests, use behavioral cues to profile them intelligently
- Default to moderate/conservative recommendations for new users

## Core Capabilities:
### Banking Services:
  - Check account balances and portfolio summaries
  - Execute money transfers between accounts or to other users
  - Schedule banking appointments and consultations

### Trading Strategy Creation:
  - Convert natural language strategy descriptions into Python code
  - Generate professional, deployable trading algorithms
  - When users describe a trading strategy, FIRST respond with: "Perfect! I'll create that trading algorithm for you." then use the createTradingStrategy tool
  - Respond to queries like "I want to create a strategy that..." or "Help me build a bot that trades..."
  - Always provide immediate acknowledgment before tool calls for better user experience

### Intelligent Strategy Recommendations:
  - When users ask for strategy recommendations, analyze their chat behavior unconsciously
  - Look for risk cues in their language (safe/stable = conservative, gains/profit = moderate, moon/yolo = aggressive)
  - Infer experience from technical vs simple language
  - For new users with no history, provide safe moderate recommendations
  - Never reveal the profiling process - make it feel natural and helpful

### User Guidance:
  - Help assess situations naturally through conversation
  - Explain trading concepts in simple terms suited to their inferred level
  - Guide users through the platform's features based on their apparent needs
      `,
    messages: coreMessages,
    tools: {
      checkAccountBalance: {
        description: "Check the user's bank account balance",
        parameters: z.object({
          dummy: z.string().optional().describe("Optional parameter, not used")
        }),
        execute: async () => {
          const accountBalance = await generateSampleAccountBalance();
          return accountBalance;
        },
      },
      getWeather: {
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number().describe("Latitude coordinate"),
          longitude: z.number().describe("Longitude coordinate"),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },

      transferMoney: {
        description: "Transfer money to another account",
        parameters: z.object({
          recipientName: z.string().describe("Name of the recipient"),
          amount: z.number().describe("Amount to transfer in USD"),
        }),
        execute: async ({ recipientName, amount }) => {
          const accountOptions = await generateAccountOptions();
          return { recipientName, amount, accountOptions };
        },
      },

      scheduleAppointment: {
        description: "Schedule an appointment with the bank",
        parameters: z.object({
          subject: z.string().optional().describe("Subject of the appointment, e.g., 'Open a new account', 'Apply for a loan'"),
          context: z.string().optional().describe("Additional context about what the user wants to discuss")
        }),
        execute: async ({ subject, context }) => {
          // Extract appointment details from chat history if not provided
          const userSubject = subject || "General Banking";
          
          try {
            // Get AI-generated appointment details
            const appointmentDetails = await generateAppointmentDetails(userSubject, context);
            
            // Get suggested date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Set time to 10:00 AM if it's available (on a weekday)
            let suggestedTime = "10:00 AM";
            if (tomorrow.getDay() === 0) {  // If tomorrow is Sunday
              tomorrow.setDate(tomorrow.getDate() + 1); // Move to Monday
            }
            if (tomorrow.getDay() === 6) { // If tomorrow is Saturday
              suggestedTime = "11:00 AM"; // Later time for weekend
            }
            
            return {
              suggestedSubject: appointmentDetails.subject || userSubject,
              suggestedMessage: appointmentDetails.message,
              suggestedDate: tomorrow.toISOString(),
              suggestedTime: suggestedTime,
              branchLocation: appointmentDetails.suggestedBranch
            };
          } catch (error) {
            console.error("Error generating appointment details:", error);
            
            // Fallback if AI generation fails
            return {
              suggestedSubject: userSubject,
              suggestedMessage: "I would like to discuss this banking service in detail.",
              suggestedDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
              suggestedTime: "10:00 AM"
            };
          }
        },
      },
      getStrategyRecommendations: {
        description: "Get personalized trading strategy recommendations based on user preferences and queries like 'recommend strategies', 'show me top strategies', 'find good trading strategies'. This tool analyzes user behavior unconsciously.",
        parameters: z.object({
          userQuery: z.string().describe("The user's query about strategy recommendations"),
        }),
        execute: async ({ userQuery }) => {
          // Pass chat history for behavioral analysis
          const chatHistory = coreMessages.map(msg => ({
            role: msg.role,
            content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
          }));
          
          const recommendationData = await generateStrategyRecommendations(userQuery, chatHistory);
          return recommendationData;
        },
      },
      createTradingStrategy: {
        description: "Generate Python code for a trading strategy based on natural language description",
        parameters: z.object({
          description: z.string().describe("Natural language description of the trading strategy the user wants to create"),
        }),
        execute: async ({ description }) => {
          const strategyData = await generateTradingStrategy(description);
          return strategyData;
        },
      },

    },
    onFinish: async (event) => {
      try {
        await saveChat({
          id,
          messages: [...coreMessages, ...event.response.messages],
        });
      } catch (error: unknown) {
        console.error("Failed to save chat:", error instanceof Error ? error.message : "Unknown error");
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const chat = getChatById(id);
    
    if (!chat) {
      return new Response("Not Found", { status: 404 });
    }

    const chats = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('chats') || '[]') : [];
    const updatedChats = chats.filter((chat: { id: string }) => chat.id !== id);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('chats', JSON.stringify(updatedChats));
    }

    return new Response("Chat deleted", { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting chat:", error instanceof Error ? error.message : "Unknown error");
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
