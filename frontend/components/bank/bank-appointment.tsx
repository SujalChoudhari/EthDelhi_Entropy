"use client";

import api from "@/utils/api";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Edit,
  Info,
  ThumbsUp
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface AppointmentFormData {
  subject: string;
  message: string;
  preferredDate: Date | undefined;
  preferredTime: string;
  branchLocation?: string;
}

interface AppointmentResponse {
  appointmentId: string;
  subject: string;
  message: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "confirmed" | "pending" | "cancelled";
  branch: {
    name: string;
    address: string;
  };
}

interface BankAppointmentProps {
  appointmentData?: {
    suggestedSubject?: string;
    suggestedMessage?: string;
    suggestedDate?: string; // ISO string format
    suggestedTime?: string; // e.g., "10:00 AM"
    branchLocation?: string;
    appointmentResponse?: AppointmentResponse;
  };
}

export function BankAppointment(props: BankAppointmentProps) {
  const initialProps = useRef(props);

  // Default values with proper fallbacks for all properties
  const appointmentData = props.appointmentData || {
    suggestedSubject: "General Banking"
  };

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Log props on mount for debugging
  useEffect(() => {
    console.log("Appointment data received:", appointmentData);

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [appointmentData]);

  // Convert suggested date string to Date object if provided
  const parsedDate = appointmentData.suggestedDate ? new Date(appointmentData.suggestedDate) : undefined;

  // Initialize form state
  const [formData, setFormData] = useState<AppointmentFormData>({
    subject: "",
    message: "",
    preferredDate: undefined,
    preferredTime: "",
    branchLocation: "Goregaon Branch"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentResponse, setAppointmentResponse] = useState<AppointmentResponse | undefined>(
    appointmentData.appointmentResponse
  );
  const [isEditing, setIsEditing] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Initialize form data just once on first render
  useEffect(() => {
    const initialData = initialProps.current.appointmentData || { suggestedSubject: "General Banking" };

    setFormData({
      subject: initialData.suggestedSubject || "General Banking",
      message: initialData.suggestedMessage || "",
      preferredDate: initialData.suggestedDate ? new Date(initialData.suggestedDate) : undefined,
      preferredTime: initialData.suggestedTime || "",
      branchLocation: initialData.branchLocation || "Goregaon Branch"
    });
  }, []); // Empty dependency array ensures this runs only once

  const branches = [
    { id: "goregaon", name: "Goregaon Branch", address: "123 Main Street, Goregaon, Mumbai 400063" },
    { id: "andheri", name: "Andheri Branch", address: "456 Link Road, Andheri West, Mumbai 400053" },
    { id: "bandra", name: "Bandra Branch", address: "789 Hill Road, Bandra West, Mumbai 400050" }
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const handleInputChange = (field: keyof AppointmentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Remove field from missing fields list if it was previously missing
    if (value && missingFields.includes(field)) {
      setMissingFields(prev => prev.filter(f => f !== field));
    }
  };

  const validateForm = () => {
    const missing: string[] = [];

    if (!formData.subject) missing.push("subject");
    if (!formData.message) missing.push("message");
    if (!formData.preferredDate) missing.push("preferredDate");
    if (!formData.preferredTime) missing.push("preferredTime");

    setMissingFields(missing);
    return missing.length === 0 ? null : `Please provide: ${missing.join(", ")}`;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      // Actual API call would be:
      try {
        const response = await api(`tickets/?account_id=${1}&subject=${formData.subject}&description=${formData.message}&preferred_day=${formData.preferredDate}&preferred_time=${formData.preferredTime}`, {
          method: "POST",
        });

        // setAppointmentResponse(response);
        toast.success("Appointment scheduled successfully!");
      } catch (error) {
        toast.error("Failed to schedule appointment. Please try again.");
      } finally {
        setIsSubmitting(false);
      }

      // Mock delay for API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find selected branch
      const selectedBranch = branches.find(b => b.name === formData.branchLocation) || branches[0];

      // Create mock response
      const response: AppointmentResponse = {
        appointmentId: `APT-${Math.floor(100000 + Math.random() * 900000)}`,
        subject: formData.subject,
        message: formData.message,
        appointmentDate: formData.preferredDate ? format(formData.preferredDate, "yyyy-MM-dd") : "",
        appointmentTime: formData.preferredTime,
        status: "pending", // Changed from confirmed to pending
        branch: {
          name: selectedBranch.name,
          address: selectedBranch.address
        }
      };

      if (isMounted.current) {
        setAppointmentResponse(response);
        setIsSubmitting(false);
        toast.success("Appointment request submitted successfully!");
      }
    } catch (error) {
      if (isMounted.current) {
        toast.error("Failed to schedule appointment. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  // If we have a response, show the confirmation
  if (appointmentResponse) {
    return (
      <motion.div
        className="bg-white dark:bg-zinc-800/90 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Appointment Request Submitted</CardTitle>
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                PENDING
              </div>
            </div>
            <CardDescription>
              Your appointment request has been submitted and is awaiting confirmation
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-3">
              <div className="size-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {appointmentResponse.appointmentDate}
                </div>
                <div className="font-medium text-blue-800 dark:text-blue-200">
                  {appointmentResponse.appointmentTime}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Subject</div>
                <div className="font-medium">{appointmentResponse.subject}</div>
              </div>

              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Message</div>
                <div className="text-sm">{appointmentResponse.message}</div>
              </div>

              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Branch</div>
                <div className="font-medium">{appointmentResponse.branch.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {appointmentResponse.branch.address}
                </div>
              </div>

              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Appointment ID</div>
                <div className="font-mono text-sm">{appointmentResponse.appointmentId}</div>
              </div>
            </div>

            {/* Information box about pending approval */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div className="font-medium text-amber-800 dark:text-amber-200">Awaiting Confirmation</div>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                Our team will review your appointment request and send you a confirmation.
                You&apos;ll receive a notification once your appointment is confirmed.
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-lg w-full">
                    <Info size={14} />
                    <span>You can check your appointment status anytime by asking in chat.</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div>Try asking &quot;What&apos;s the status of my appointment?&quot; or &quot;Check my appointment {appointmentResponse.appointmentId}&quot;</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  // Show confirmation dialog with pre-filled information
  return (
    <motion.div
      className="bg-white dark:bg-zinc-800/90 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Schedule an Appointment</CardTitle>
          <CardDescription>
            {isEditing ? "Edit appointment details" : "Please confirm your appointment details"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            // Editable form
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="e.g., Open a new account, Apply for a loan"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className={`dark:bg-zinc-700/50 ${missingFields.includes("subject") ? "border-red-500 dark:border-red-500" : ""}`}
                />
                {missingFields.includes("subject") && (
                  <p className="text-xs text-red-500 mt-1">Subject is required</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Please provide details about your request..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`min-h-[100px] dark:bg-zinc-700/50 ${missingFields.includes("message") ? "border-red-500 dark:border-red-500" : ""}`}
                />
                {missingFields.includes("message") && (
                  <p className="text-xs text-red-500 mt-1">Message is required</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal dark:bg-zinc-700/50 ${missingFields.includes("preferredDate") ? "border-red-500 dark:border-red-500" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.preferredDate ? (
                          format(formData.preferredDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.preferredDate}
                        onSelect={(date) => handleInputChange("preferredDate", date)}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0)) || // No past dates
                          date.getDay() === 0 || // No Sundays
                          date > new Date(new Date().setMonth(new Date().getMonth() + 2)) // Max 2 months ahead
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {missingFields.includes("preferredDate") && (
                    <p className="text-xs text-red-500 mt-1">Date is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Time</label>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value) => handleInputChange("preferredTime", value)}
                  >
                    <SelectTrigger className={`dark:bg-zinc-700/50 ${missingFields.includes("preferredTime") ? "border-red-500 dark:border-red-500" : ""}`}>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {missingFields.includes("preferredTime") && (
                    <p className="text-xs text-red-500 mt-1">Time is required</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Branch Location</label>
                <Select
                  value={formData.branchLocation}
                  onValueChange={(value) => handleInputChange("branchLocation", value)}
                >
                  <SelectTrigger className="dark:bg-zinc-700/50">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.name}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            // Confirmation view
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <div className="mb-2 text-blue-700 dark:text-blue-300 font-medium">
                  Based on your conversation, we&apos;ve prepared the following appointment:
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border-b dark:border-zinc-700">
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Subject</div>
                    <div className="font-medium">{formData.subject || "(No subject provided)"}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 border-b dark:border-zinc-700">
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Details</div>
                    <div className="text-sm">{formData.message || "(No details provided)"}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 border-b dark:border-zinc-700">
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Date</div>
                    <div className="font-medium">
                      {formData.preferredDate ? format(formData.preferredDate, "EEEE, MMMM d, yyyy") : (
                        <span className="text-amber-600 dark:text-amber-400">Not selected - please edit</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 border-b dark:border-zinc-700">
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Time</div>
                    <div className="font-medium">
                      {formData.preferredTime || (
                        <span className="text-amber-600 dark:text-amber-400">Not selected - please edit</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3">
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Branch</div>
                    <div className="font-medium">{formData.branchLocation}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {branches.find(b => b.name === formData.branchLocation)?.address ||
                        "123 Main Street, Goregaon, Mumbai 400063"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className="bg-primary text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
} 