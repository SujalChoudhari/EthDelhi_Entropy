import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiFlashModel } from "@/ai";
import {
  generateSampleAccountBalance,
  generateAccountOptions,
  generateAppointmentDetails,
} from "@/ai/actions";
import { generateUUID, saveChat, getChatById } from "@/lib/utils";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model: geminiFlashModel,
    system: `\n
- you help users with banking services!
- keep your responses limited to a sentence.
- DO NOT output lists.
- you can respond in Indian languages (Hindi, Marathi, etc.) if the user speaks in those languages
- Use Indian Currency (₹/INR) for all monetary values and transactions
- after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
- today's date is ${new Date().toLocaleDateString()}.
- ask follow up questions to nudge user into the optimal flow
- NOTE YOU PERSONALLY HAVE NO DATA OF USER, AND CAN ONLY USE TOOLS.
- for banking:
  - you can check account balances
  - you can transfer money between accounts or to other people
  - for money transfers, ask for recipient name and amount if not specified
  - remind users they'll need their device password to complete transfers
  - you can schedule appointments for banking services
  - when scheduling appointments, extract details from the chat history
  - if user doesn't specify a date, time, or details, proactively ask for this information
  - always try to suggest a complete appointment with subject, details, date and time based on context
  - respond to queries like "I want an appointment for creating a current account" or "I want a personal loan" by scheduling an appointment

 If there query is very vague and they dont mention what type of loan then suggest below type of availble loans we have and prompt them to choose.

## Available Financial Solutions
**Home Loans**
- Interest Rate: Starting from 8.40% p.a.
- Features: Flexible tenure, quick processing, minimal documentation
- Ideal for: Home purchase, construction, renovation, or refinancing existing loans

**Education Loans**
- Interest Rate: Starting from 7.90% p.a.
- Features: Covers tuition, accommodation, equipment, and study materials
- Ideal for: Higher education in India or abroad, professional courses

**Vehicle Loans**
- Interest Rate: Starting from 8.75% p.a.
- Features: Quick approval, competitive rates, flexible repayment
- Ideal for: New or pre-owned vehicles, two-wheelers or four-wheelers

**Personal Loans**
- Interest Rate: Starting from 10.20% p.a.
- Features: Minimal documentation, quick disbursement, no collateral
- Ideal for: Medical expenses, travel, weddings, debt consolidation

**Business Loans**
- Interest Rate: Based on business profile and credit assessment
- Features: Working capital, equipment financing, expansion funding
- Ideal for: Business growth, inventory management, operational expenses

**Agriculture Loans**
- Interest Rate: Based on scheme eligibility
- Features: Seasonal crop loans, equipment purchase, land development
- Ideal for: Farmers, agricultural enterprises, rural development projects

**Gold Loans**
- Interest Rate: Starting from 7.35% p.a.
- Features: Quick processing, high loan-to-value ratio, minimal documentation
- Ideal for: Emergency funding, business needs, personal expenses
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
