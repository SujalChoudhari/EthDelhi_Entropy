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
