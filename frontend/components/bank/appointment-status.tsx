"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  Clock, 
  CheckCircle, 
  Info, 
  XCircle,
  AlertTriangle,
  ChevronDown,
  MapPin,
  Building,
  Video
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface AppointmentDetails {
  appointmentId: string;
  subject: string;
  message: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
  branch: {
    id: string;
    name: string;
    address: string;
  };
  assignedTo?: {
    name: string;
    department: string;
  };
  notes?: string[];
}

interface AppointmentStatusProps {
  statusData?: {
    appointments: AppointmentDetails[];
    selectedAppointmentId?: string;
  };
}

export function AppointmentStatus({ 
  statusData = {
    appointments: [
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
    ],
    selectedAppointmentId: "APT-123456"
  }
}) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>(
    statusData.selectedAppointmentId || 
    (statusData.appointments.length > 0 ? statusData.appointments[0].appointmentId : "")
  );
  
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelNote, setCancelNote] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentDetails[]>(statusData.appointments);
  
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  
  const selectedAppointment = appointments.find(apt => apt.appointmentId === selectedAppointmentId);
  
  if (!selectedAppointment) {
    return (
      <motion.div
        className="bg-white dark:bg-zinc-800/90 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Appointments Found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">
            You don't have any scheduled appointments at the moment.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white">
            Schedule an Appointment
          </Button>
        </div>
      </motion.div>
    );
  }
  
  const handleCancelAppointment = () => {
    if (!cancelReason) {
      toast.error("Please select a reason for cancellation");
      return;
    }
    
    setIsCancelling(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedAppointments = appointments.map(apt => 
        apt.appointmentId === selectedAppointmentId 
          ? { 
              ...apt, 
              status: "cancelled" as const,
              updatedAt: new Date().toISOString(),
              notes: [...(apt.notes || []), `Cancelled: ${cancelReason}${cancelNote ? ` - ${cancelNote}` : ''}`]
            } 
          : apt
      );
      
      setAppointments(updatedAppointments);
      setIsCancelling(false);
      toast.success("Appointment cancelled successfully");
    }, 1500);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  const cancelReasons = [
    "Not available at the scheduled time",
    "Branch location is too far",
    "Query has been resolved already",
    "Found information elsewhere",
    "No longer need assistance",
    "Prefer to reschedule for another day",
    "Other reason"
  ];
  
  const generateRoomId = (appointmentId: string) => {
    return `support-${appointmentId}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  };
  
  const handleStartVideoCall = () => {
    setIsVideoCallActive(true);
    toast.success("Video call initiated. Please wait for the representative to join.");
  };
  
  return (
    <motion.div
      className="bg-white dark:bg-zinc-800/90 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">Appointment Status</CardTitle>
            
            <Select 
              value={selectedAppointmentId} 
              onValueChange={setSelectedAppointmentId}
            >
              <SelectTrigger className="w-full sm:w-[260px] dark:bg-zinc-700/50">
                <SelectValue placeholder="Select appointment" />
              </SelectTrigger>
              <SelectContent>
                {appointments.map((apt) => (
                  <SelectItem key={apt.appointmentId} value={apt.appointmentId}>
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate mr-2">{apt.subject}</span>
                      <span className="text-xs opacity-70">
                        {format(new Date(apt.appointmentDate), "MMM d")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            View and manage your appointment details
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status Banner */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="font-medium">Status:</div>
              {getStatusBadge(selectedAppointment.status)}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              ID: {selectedAppointment.appointmentId}
            </div>
          </div>
          
          {/* Video Call Section */}
          {selectedAppointment.status === "confirmed" && (
            <motion.div 
              className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isVideoCallActive ? (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Call Active
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setIsVideoCallActive(false)}
                    >
                      End Call
                    </Button>
                  </div>
                  
                  <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-full">
                        <Building size={14} />
                      </div>
                      <div>
                        <div className="font-medium">{selectedAppointment.branch.name}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {selectedAppointment.subject}
                        </div>
                      </div>
                    </div>
                    
                    <a 
                      href={`https://chat.1410inc.xyz/?room=${generateRoomId(selectedAppointment.appointmentId)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
                      >
                        Join Video Call
                      </Button>
                    </a>
                    
                    <div className="text-xs text-center mt-2 text-zinc-500 dark:text-zinc-400">
                      Representatives are available from 9 AM to 6 PM IST
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                      <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Join video call
                      </div>
                      <div className="font-medium text-blue-800 dark:text-blue-200">
                        Start a video call with our representative
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={handleStartVideoCall}
                  >
                    Start Call
                  </Button>
                </>
              )}
            </motion.div>
          )}
          
          {/* Appointment Date & Time */}
          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/80 p-3 rounded-lg">
            <div className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded-full">
              <CalendarIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                {format(new Date(selectedAppointment.appointmentDate), "EEEE, MMMM d, yyyy")}
              </div>
              <div className="font-medium text-zinc-800 dark:text-zinc-200">
                {selectedAppointment.appointmentTime}
              </div>
            </div>
            {selectedAppointment.status === "confirmed" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogDescription>
                      Please let us know why you're cancelling this appointment.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <RadioGroup value={cancelReason} onValueChange={setCancelReason}>
                      {cancelReasons.map((reason) => (
                        <div key={reason} className="flex items-center space-x-2 py-1">
                          <RadioGroupItem value={reason} id={reason.replace(/\s+/g, '-')} />
                          <Label htmlFor={reason.replace(/\s+/g, '-')}>{reason}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {cancelReason === "Other reason" && (
                      <div className="mt-3">
                        <Label htmlFor="cancel-note">Additional details</Label>
                        <Textarea 
                          id="cancel-note"
                          placeholder="Please provide more details..."
                          value={cancelNote}
                          onChange={(e) => setCancelNote(e.target.value)}
                          className="mt-1 dark:bg-zinc-800"
                        />
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCancelReason("");
                        setCancelNote("");
                      }}
                    >
                      Keep Appointment
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleCancelAppointment}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Appointment"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {/* Branch Information */}
          <div className="p-3 border border-zinc-100 dark:border-zinc-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-zinc-500" />
              <h3 className="font-medium">Branch Information</h3>
            </div>
            <div className="pl-6">
              <div className="font-medium">{selectedAppointment.branch.name}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-start gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{selectedAppointment.branch.address}</span>
              </div>
            </div>
          </div>
          
          {/* Appointment Details */}
          <Accordion type="single" collapsible className="border border-zinc-100 dark:border-zinc-700 rounded-lg overflow-hidden">
            <AccordionItem value="details" className="border-b-0">
              <AccordionTrigger className="px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-zinc-500" />
                  <span>Appointment Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Subject</div>
                    <div className="font-medium">{selectedAppointment.subject}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Message</div>
                    <div className="text-sm">{selectedAppointment.message}</div>
                  </div>
                  
                  {selectedAppointment.assignedTo && (
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Assigned To</div>
                      <div className="font-medium">{selectedAppointment.assignedTo.name}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {selectedAppointment.assignedTo.department}
                      </div>
                    </div>
                  )}
                  
                  {selectedAppointment.notes && selectedAppointment.notes.length > 0 && (
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Notes</div>
                      <ul className="text-sm space-y-1">
                        {selectedAppointment.notes.map((note, index) => (
                          <li key={index} className="pl-2 border-l-2 border-zinc-200 dark:border-zinc-700">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <div>
                      <span>Created: </span>
                      <span>{format(new Date(selectedAppointment.createdAt), "MMM d, yyyy h:mm a")}</span>
                    </div>
                    <div>
                      <span>Updated: </span>
                      <span>{format(new Date(selectedAppointment.updatedAt), "MMM d, yyyy h:mm a")}</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        
        <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <Info size={12} />
            <span>You can check other appointments using the dropdown above.</span>
          </div>
          
          {selectedAppointment.status === "confirmed" && !isVideoCallActive && (
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                toast.success("Reminder sent to your email and phone");
              }}
            >
              <Clock className="h-4 w-4 mr-2" />
              Send Reminder
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
} 