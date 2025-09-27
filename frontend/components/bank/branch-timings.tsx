"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "../ui/calendar";
import { Clock, Calendar as CalendarIcon, MapPin, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface BranchHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: BranchHours[];
  specialDates?: {
    date: string | Date;
    isOpen: boolean;
    reason?: string;
  }[];
}

interface BranchTimingsProps {
  branchData?: {
    selectedBranchId: string;
    branches: Branch[];
    currentDate: string;
  };
}

export function BranchTimings({ 
  branchData = {
    selectedBranchId: "branch-1",
    branches: [
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
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
            isOpen: false,
            reason: "Christmas Day"
          },
          {
            date: new Date(new Date().getFullYear(), 0, 1),
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
    ],
    currentDate: new Date().toISOString()
  }
}) {
  const [date, setDate] = useState<Date | undefined>(new Date(branchData.currentDate));
  const [selectedBranch, setSelectedBranch] = useState(branchData.selectedBranchId);
  
  const branch = branchData.branches.find(b => b.id === selectedBranch) || branchData.branches[0];
  
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = branch.hours.find(h => h.day === dayOfWeek);
  
  // Helper function to convert string or Date to Date object
  const ensureDate = (dateInput: string | Date): Date => {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    return new Date(dateInput);
  };
  
  // Helper function to check if a date is a special date
  const isSpecialDate = (date: Date): boolean => {
    return branch.specialDates?.some(sd => {
      const specialDate = ensureDate(sd.date);
      return (
        specialDate.getDate() === date.getDate() && 
        specialDate.getMonth() === date.getMonth() && 
        specialDate.getFullYear() === date.getFullYear()
      );
    }) || false;
  };
  
  // Function to get hours for a specific date
  const getHoursForDate = (date: Date) => {
    // Check if it's a special date
    const specialDate = branch.specialDates?.find(sd => {
      const sdDate = ensureDate(sd.date);
      return (
        sdDate.getDate() === date.getDate() && 
        sdDate.getMonth() === date.getMonth() && 
        sdDate.getFullYear() === date.getFullYear()
      );
    });
    
    if (specialDate) {
      return specialDate.isOpen ? "Special hours" : `Closed - ${specialDate.reason}`;
    }
    
    // Regular hours based on day of week
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayHours = branch.hours.find(h => h.day === dayOfWeek);
    
    if (!dayHours || !dayHours.isOpen) return "Closed";
    return `${dayHours.open} - ${dayHours.close}`;
  };
  
  const isOpenNow = () => {
    if (!todayHours?.isOpen) return false;
    
    // Check if there's a special date for today
    const specialDate = branch.specialDates?.find(sd => {
      const sdDate = ensureDate(sd.date);
      return (
        sdDate.getDate() === today.getDate() && 
        sdDate.getMonth() === today.getMonth() && 
        sdDate.getFullYear() === today.getFullYear()
      );
    });
    
    if (specialDate) return specialDate.isOpen;
    
    // Check if within regular hours
    if (!todayHours.open || !todayHours.close) return false;
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const [openHour, openMinute] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
    
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    return currentTime >= openTime && currentTime < closeTime;
  };
  
  return (
    <motion.div
      className="bg-white dark:bg-zinc-800/90 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-lg">{branch.name}</h3>
            <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              <MapPin size={14} />
              <span>{branch.address}</span>
            </div>
          </div>
          
          <div>
            {isOpenNow() ? (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                Open Now
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
                Closed Now
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  Today&apos;s Hours
                </div>
              </CardTitle>
              <CardDescription>
                {dayOfWeek}, {today.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayHours?.isOpen ? (
                <div className="font-medium text-lg">
                  {todayHours.open} - {todayHours.close}
                </div>
              ) : (
                <div className="font-medium text-lg text-red-600 dark:text-red-400">
                  Closed Today
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CalendarIcon size={16} className="text-blue-500" />
              Weekly Hours
            </h4>
            <div className="space-y-2 text-sm">
              {branch.hours.map((hours, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={`${dayOfWeek === hours.day ? 'font-medium' : ''}`}>
                    {hours.day}
                  </span>
                  <span>
                    {hours.isOpen ? (
                      `${hours.open} - ${hours.close}`
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Closed</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <h4 className="font-medium mb-3 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <CalendarIcon size={16} className="text-blue-500" />
            Branch Calendar
          </h4>
          
          <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="mx-auto"
              modifiers={{
                closed: (date) => {
                  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                  const specialDate = branch.specialDates?.find(sd => {
                    const sdDate = ensureDate(sd.date);
                    return (
                      sdDate.getDate() === date.getDate() && 
                      sdDate.getMonth() === date.getMonth() && 
                      sdDate.getFullYear() === date.getFullYear()
                    );
                  });
                  
                  if (specialDate) return !specialDate.isOpen;
                  
                  const dayHours = branch.hours.find(h => h.day === dayOfWeek);
                  return !dayHours?.isOpen;
                },
                special: (date) => isSpecialDate(date)
              }}
              modifiersClassNames={{
                closed: "text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
                special: "bg-amber-50 dark:bg-amber-900/20 font-medium"
              }}
            />
          </div>
          
          {date && (
            <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div>
                  {getHoursForDate(date)}
                </div>
              </div>
              
              {isSpecialDate(date as Date) && (
                <div className="mt-2 text-sm flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Info size={14} />
                  <span>
                    {branch.specialDates?.find(sd => {
                      const sdDate = ensureDate(sd.date);
                      return (
                        sdDate.getDate() === date?.getDate() && 
                        sdDate.getMonth() === date?.getMonth() && 
                        sdDate.getFullYear() === date?.getFullYear()
                      );
                    })?.reason}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {branch.specialDates && branch.specialDates.length > 0 && (
          <div className="mt-1">
            <h4 className="font-medium mb-2 text-sm text-zinc-600 dark:text-zinc-400">Special Dates</h4>
            <div className="space-y-2 text-sm">
              {branch.specialDates.map((specialDate, index) => {
                const sdDate = ensureDate(specialDate.date);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className={specialDate.isOpen ? 
                      "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800" : 
                      "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                    }>
                      {specialDate.isOpen ? "Open" : "Closed"}
                    </Badge>
                    <span>
                      {sdDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {specialDate.reason}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 