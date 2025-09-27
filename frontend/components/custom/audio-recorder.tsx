"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Mic, MicOff, X } from "lucide-react";
import { toast } from "sonner";

interface AudioRecorderProps {
  onTranscriptionReady: (transcription: string) => void;
  onCancel: () => void;
}

export function AudioRecorder({ onTranscriptionReady, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isPreparing, setIsPreparing] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up function to stop everything
  const cleanUp = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsPreparing(true);
      
      // Reset chunks
      audioChunksRef.current = [];
      
      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Use WebM for better compatibility
      });
      mediaRecorderRef.current = mediaRecorder;
      
      // Setup event listeners
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorder.addEventListener("stop", transcribeAudio);
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsPreparing(false);
      setRecordingDuration(0);
      
      // Start the duration timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsPreparing(false);
      toast.error("Failed to start recording. Please check your microphone permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      // Stop all audio tracks
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const transcribeAudio = async () => {
    try {
      // Create a blob from the audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioBlob(audioBlob);
      setIsTranscribing(true);
      
      // In a real app, we would upload this to a server endpoint that uses Groq API
      // For now, we'll simulate the transcription with a timeout
      try {
        // Create a FormData object to send the audio file
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        
        // Call your API endpoint that handles Groq transcription
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Transcription failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Call the callback with the transcribed text
        onTranscriptionReady(result.text);
      } catch (error) {
        console.error("Error transcribing audio:", error);
        toast.error("Failed to transcribe audio. Using fallback method.");
        
        // As a fallback, simulate a successful transcription
        // In production, you should handle errors more gracefully
        setTimeout(() => {
          const mockTranscription = "This is a simulated transcription since the Groq API call failed.";
          onTranscriptionReady(mockTranscription);
        }, 1000);
      } finally {
        setIsTranscribing(false);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Failed to process audio recording");
      setIsTranscribing(false);
    }
  };
  
  // Format seconds into MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {isRecording ? "Recording in progress..." : 
           isTranscribing ? "Transcribing audio..." : 
           "Start Speaking"}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 h-auto"
          onClick={onCancel}
          disabled={isTranscribing}
        >
          <X size={16} />
        </Button>
      </div>
      
      {/* Duration display */}
      <div className="text-2xl font-mono mb-4 text-zinc-800 dark:text-zinc-200">
        {formatDuration(recordingDuration)}
      </div>
      
      {/* Record controls */}
      <div className="flex items-center gap-3 mb-4">
        {!isTranscribing && (
          <Button
            type="button"
            className={`rounded-full p-3 h-12 w-12 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isPreparing || isTranscribing}
          >
            {isRecording ? (
              <MicOff size={20} className="text-white" />
            ) : (
              <Mic size={20} className="text-white" />
            )}
          </Button>
        )}
      </div>
      
      {isTranscribing && (
        <div className="flex items-center justify-center w-full py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-blue-500"></div>
          <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">Converting speech to text...</span>
        </div>
      )}
      
      {isRecording && (
        <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Click the microphone icon again to stop recording and transcribe.
        </div>
      )}
    </div>
  );
} 