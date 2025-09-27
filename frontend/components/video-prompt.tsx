"use client";
import { GoogleGenerativeAI } from '@google/generative-ai';
import React, { useState, useRef } from 'react';

interface ImagePromptProps {
  description: string | null;
  setDescription: (description: string) => void;
}

const VideoPrompt: React.FC<ImagePromptProps> = ({ description, setDescription }) => {
  const [recording, setRecording] = useState(false);
  const [inferencing, setInferencing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setRecording(false);
    setInferencing(true);

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const reader = new FileReader();

      reader.onload = async () => {
        const fileData = reader.result as string;
        const base64Data = fileData.split(",")[1];

        const genAI = new GoogleGenerativeAI(
          process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
            "AIzaSyDO8lzIyA7UdDO9Fn6t_QJjQtfY_2b8vQA"
        );
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Describe what you saw in the given media. If it has audio, highlight it too.";
        const media = {
          inlineData: {
            data: base64Data,
            mimeType: "video/mp4",
          },
        };

        try {
          const result = await model.generateContent([prompt, media]);
          setDescription(result.response.text());
        } catch (error) {
          console.error("Error generating content:", error);
        } finally {
          setInferencing(false);
        }
      };
      reader.readAsDataURL(blob);
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full aspect-video bg-gray-900 rounded-lg shadow-lg"
        />

        <div className="flex flex-col items-center gap-4">
          {recording && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full animate-pulse w-full"></div>
              <p className="text-center mt-2 text-sm text-gray-600">
                Recording in progress...
              </p>
            </div>
          )}

          {inferencing && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-[width_1.5s_ease-in-out_infinite]"></div>
              <p className="text-center mt-2 text-sm text-gray-600">
                Analyzing video...
              </p>
            </div>
          )}

          {!recording && !inferencing ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <span className="w-3 h-3 rounded-full bg-white" />
              Start Recording
            </button>
          ) : (
            !inferencing && (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <span className="w-3 h-3 bg-white rounded" />
                Stop Recording
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPrompt;
