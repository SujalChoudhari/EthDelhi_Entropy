import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";

export async function generateSampleFlightStatus({
  flightNumber,
  date,
}: {
  flightNumber: string;
  date: string;
}) {
  const { object: flightStatus } = await generateObject({
    model: geminiFlashModel,
    prompt: `Flight status for flight number ${flightNumber} on ${date}`,
    schema: z.object({
      flightNumber: z.string().describe("Flight number, e.g., BA123, AA31"),
      departure: z.object({
        cityName: z.string().describe("Name of the departure city"),
        airportCode: z.string().describe("IATA code of the departure airport"),
        airportName: z.string().describe("Full name of the departure airport"),
        timestamp: z.string().describe("ISO 8601 departure date and time"),
        terminal: z.string().describe("Departure terminal"),
        gate: z.string().describe("Departure gate"),
      }),
      arrival: z.object({
        cityName: z.string().describe("Name of the arrival city"),
        airportCode: z.string().describe("IATA code of the arrival airport"),
        airportName: z.string().describe("Full name of the arrival airport"),
        timestamp: z.string().describe("ISO 8601 arrival date and time"),
        terminal: z.string().describe("Arrival terminal"),
        gate: z.string().describe("Arrival gate"),
      }),
      totalDistanceInMiles: z
        .number()
        .describe("Total flight distance in miles"),
    }),
  });

  return flightStatus;
}

export async function generateSampleFlightSearchResults({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) {
  const { object: flightSearchResults } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate search results for flights from ${origin} to ${destination}, limit to 4 results`,
    output: "array",
    schema: z.object({
      id: z
        .string()
        .describe("Unique identifier for the flight, like BA123, AA31, etc."),
      departure: z.object({
        cityName: z.string().describe("Name of the departure city"),
        airportCode: z.string().describe("IATA code of the departure airport"),
        timestamp: z.string().describe("ISO 8601 departure date and time"),
      }),
      arrival: z.object({
        cityName: z.string().describe("Name of the arrival city"),
        airportCode: z.string().describe("IATA code of the arrival airport"),
        timestamp: z.string().describe("ISO 8601 arrival date and time"),
      }),
      airlines: z.array(
        z.string().describe("Airline names, e.g., American Airlines, Emirates"),
      ),
      priceInUSD: z.number().describe("Flight price in Indian Rupees"),
      numberOfStops: z.number().describe("Number of stops during the flight"),
    }),
  });

  return { flights: flightSearchResults };
}

export async function generateSampleSeatSelection({
  flightNumber,
}: {
  flightNumber: string;
}) {
  const { object: rows } = await generateObject({
    model: geminiFlashModel,
    prompt: `Simulate available seats for flight number ${flightNumber}, 6 seats on each row and 5 rows in total, adjust pricing based on location of seat`,
    output: "array",
    schema: z.array(
      z.object({
        seatNumber: z.string().describe("Seat identifier, e.g., 12A, 15C"),
        priceInUSD: z
          .number()
          .describe("Seat price in Indian Rupees, less than ₹7000"),
        isAvailable: z
          .boolean()
          .describe("Whether the seat is available for booking"),
      }),
    ),
  });

  return { seats: rows };
}

export async function generateReservationPrice(props: {
  seats: string[];
  flightNumber: string;
  departure: {
    cityName: string;
    airportCode: string;
    timestamp: string;
    gate: string;
    terminal: string;
  };
  arrival: {
    cityName: string;
    airportCode: string;
    timestamp: string;
    gate: string;
    terminal: string;
  };
  passengerName: string;
}) {
  const { object: reservation } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate price for the following reservation \n\n ${JSON.stringify(props, null, 2)}`,
    schema: z.object({
      totalPriceInUSD: z
        .number()
        .describe("Total reservation price in Indian Rupees"),
    }),
  });

  return reservation;
}

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

export async function generateLoanData() {
  return {
    accounts: [
      {
        accountId: "checking",
        accountName: "Checking (••••3456)",
        loans: [
          {
            loanId: "l-001",
            loanName: "Home Mortgage",
            amount: 250000,
            remainingAmount: 198250.45,
            nextInstallmentDate: "2023-06-15",
            nextInstallmentAmount: 1350.75,
            startDate: "2020-03-10",
            endDate: "2050-03-10",
            interestRate: 4.5,
            category: "Mortgage",
            additionalDetails: {
              "Property Address": "123 Main St, Anytown",
              "Loan Term": "30 years",
              "Payment Frequency": "Monthly",
              "Loan Status": "In good standing"
            }
          },
          {
            loanId: "l-002",
            loanName: "Auto Loan",
            amount: 32000,
            remainingAmount: 15780.32,
            nextInstallmentDate: "2023-06-22",
            nextInstallmentAmount: 525.40,
            startDate: "2021-05-15",
            endDate: "2026-05-15",
            interestRate: 3.75,
            category: "Vehicle",
            additionalDetails: {
              "Vehicle": "2021 Honda Accord",
              "Loan Term": "5 years",
              "Payment Frequency": "Monthly",
              "Loan Status": "In good standing"
            }
          }
        ]
      },
      {
        accountId: "savings",
        accountName: "Savings (••••8901)",
        loans: [
          {
            loanId: "l-003",
            loanName: "Personal Loan",
            amount: 10000,
            remainingAmount: 6540.80,
            nextInstallmentDate: "2023-06-05",
            nextInstallmentAmount: 315.25,
            startDate: "2022-01-10",
            endDate: "2025-01-10",
            interestRate: 7.25,
            category: "Personal",
            additionalDetails: {
              "Purpose": "Home renovation",
              "Loan Term": "3 years",
              "Payment Frequency": "Monthly",
              "Loan Status": "In good standing"
            }
          }
        ]
      }
    ]
  };
}

export async function generateBranchTimings(branchId?: string) {
  // Create sample branch data with realistic timings
  const branches = [
    {
      id: "branch-1",
      name: "Main Street Branch",
      address: "123 Main Street, Anytown, AN 12345",
      phone: "(555) 123-4567",
      hours: [
        { day: "Monday", open: "09:00", close: "17:00", isOpen: true },
        { day: "Tuesday", open: "09:00", close: "17:00", isOpen: true },
        { day: "Wednesday", open: "09:00", close: "17:00", isOpen: true },
        { day: "Thursday", open: "09:00", close: "17:00", isOpen: true },
        { day: "Friday", open: "09:00", close: "17:00", isOpen: true },
        { day: "Saturday", open: "10:00", close: "14:00", isOpen: true },
        { day: "Sunday", open: "", close: "", isOpen: false },
      ],
      specialDates: [
        {
          date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString(),
          isOpen: false,
          reason: "Christmas Day"
        },
        {
          date: new Date(new Date().getFullYear(), 0, 1).toISOString(),
          isOpen: false,
          reason: "New Year's Day"
        }
      ]
    },
    {
      id: "branch-2",
      name: "Downtown Financial Center",
      address: "456 Market Plaza, Anytown, AN 12345",
      phone: "(555) 987-6543",
      hours: [
        { day: "Monday", open: "08:30", close: "18:00", isOpen: true },
        { day: "Tuesday", open: "08:30", close: "18:00", isOpen: true },
        { day: "Wednesday", open: "08:30", close: "18:00", isOpen: true },
        { day: "Thursday", open: "08:30", close: "18:00", isOpen: true },
        { day: "Friday", open: "08:30", close: "18:00", isOpen: true },
        { day: "Saturday", open: "09:00", close: "16:00", isOpen: true },
        { day: "Sunday", open: "12:00", close: "16:00", isOpen: true },
      ]
    }
  ];
  
  // If a branch ID was provided, use that branch
  const selectedBranchId = branchId || "branch-1";
  
  return {
    selectedBranchId,
    branches,
    currentDate: new Date().toISOString()
  };
}

export async function generateAppointmentData() {
  return [
    {
      appointmentId: "APT-123456",
      subject: "Open a Current Account",
      message: "I would like to open a new current account with overdraft facility.",
      appointmentDate: "2023-06-15",
      appointmentTime: "10:00 AM",
      status: "confirmed",
      createdAt: "2023-06-01T14:30:00Z",
      updatedAt: "2023-06-01T14:35:00Z",
      branch: {
        id: "branch-1",
        name: "Main Street Branch",
        address: "123 Main Street, Anytown, AN 12345"
      },
      assignedTo: {
        name: "Sarah Johnson",
        department: "Personal Banking"
      },
      notes: [
        "Customer is a new client",
        "Interested in savings options as well"
      ]
    },
    {
      appointmentId: "APT-789012",
      subject: "Personal Loan Inquiry",
      message: "I need information about getting a personal loan for home renovation.",
      appointmentDate: "2023-06-20",
      appointmentTime: "02:30 PM",
      status: "pending",
      createdAt: "2023-06-02T09:15:00Z",
      updatedAt: "2023-06-02T09:20:00Z",
      branch: {
        id: "branch-2",
        name: "Downtown Financial Center",
        address: "456 Market Plaza, Anytown, AN 12345"
      }
    }
  ];
}

export async function extractAppointmentDetails(chatHistory: any) {
  const { object: details } = await generateObject({
    model: geminiFlashModel,
    prompt: `Based on this chat history, extract the most likely details for a bank appointment. If certain details aren't explicitly mentioned, make reasonable suggestions based on context:
    
    Chat history:
    ${JSON.stringify(chatHistory)}`,
    schema: z.object({
      subject: z.string().describe("The subject/purpose of the appointment"),
      message: z.string().describe("Detailed information about what the customer needs"),
      suggestedDate: z.string().describe("A suggested date for the appointment in ISO format"),
      suggestedTime: z.string().describe("A suggested time like '10:00 AM'"),
      branchLocation: z.string().optional().describe("Preferred branch location if mentioned")
    }),
  });

  return details;
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
