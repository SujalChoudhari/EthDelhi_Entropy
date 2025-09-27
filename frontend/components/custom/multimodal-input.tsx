"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import api from "@/utils/api";
import { Mic, Paperclip, VideoIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import VideoPrompt from "../video-prompt";
import { AudioRecorder } from "./audio-recorder";
import { ArrowUpIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";

const suggestedActions = [
  {
    title: "Check account balance",
    label: "View checking, savings, and credit",
    action: "Check balence in my bank account",
    icon: "💰",
  },
  {
    title: "Transfer",
    label: "Transfer 100 INR to my savings account",
    action: "I wan't to transfer 100 INR to my other savings account",
    icon: "🪙",
  },
  {
    title: "View transaction history",
    label: "See recent account activity",
    action: "View my transaction history",
    icon: "📊",
  },
  {
    title: "Book an appointment",
    label: "Book an appointment with the manager",
    action: "I wan't to book an appointment.",
    icon: "📅",
  },
];

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);

  const [description, setDescriptionWorker] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const setDescription = (description: string) => {
    handleInput({ target: { value: description } } as ChangeEvent<HTMLTextAreaElement>);
    setDescriptionWorker(description);
  }

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 0}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = async (file: File) => {
    console.log('Starting upload for file:', file.name);
    const formData = new FormData();
    formData.append("files", file, file.name);

    try {
      console.log('Sending request to upload file');
      const response = await api(`files/upload`, {
        method: "POST",
        body: formData,
      });

      console.log('Upload response:', response);
      const data = response;
      const { url, pathname, contentType } = data;

      console.log('File uploaded successfully:', { url, pathname, contentType });
      return {
        url,
        name: pathname,
        contentType: contentType,
      };

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file, please try again!");
      return undefined;
    }
  };


  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  const handleTranscription = (transcription: string) => {
    setInput(transcription);
    setShowAudioRecorder(false);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }

    // Adjust the height of the textarea to fit the new content
    setTimeout(adjustHeight, 0);
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 &&
        !showAudioRecorder && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mx-auto md:max-w-[600px]">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.08 * index }}
                key={`suggested-action-${index}`}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="group border-none bg-white dark:bg-zinc-800 w-full text-left rounded-xl p-4 text-sm 
                    hover:bg-zinc-50 dark:hover:bg-zinc-700/80 transition-all duration-300 
                    flex flex-row items-center gap-3 shadow-sm hover:shadow-md dark:shadow-zinc-900/30 dark:hover:shadow-zinc-900/50"
                >
                  <div className="flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 
                    dark:from-zinc-700 dark:to-zinc-800 size-10 rounded-full shadow-inner p-1.5 
                    group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">{suggestedAction.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 mb-0.5">{suggestedAction.title}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {suggestedAction.label}
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment, idx) => (
            <PreviewAttachment
              key={`attachment-${attachment.name}-${idx}`}
              attachment={attachment}
            />
          ))}

          {uploadQueue.map((filename, idx) => (
            <PreviewAttachment
              key={`upload-queue-${filename}-${idx}`}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      {showAudioRecorder ? (
        <AudioRecorder
          onTranscriptionReady={handleTranscription}
          onCancel={() => setShowAudioRecorder(false)}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={input}
          onChange={handleInput}
          className="resize-none rounded-2xl text-base bg-muted"
          rows={3}
          onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error("Please wait for the model to finish its response!");
              } else {
                submitForm();
              }
            }
          }}
        />
      )}

      <div className="absolute right-2 bottom-[8px] flex items-center gap-2">
        {!showAudioRecorder && (
          <>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="rounded-xl p-2 h-fit border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 bg-transparent"
                  variant="outline"
                  disabled={isLoading}
                >
                  <VideoIcon size={18} className="text-zinc-500 dark:text-zinc-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" side="top" align="center">
                <div className="w-[500px]">
                  <VideoPrompt
                    description={description}
                    setDescription={(desc) => {
                      setDescription(desc);
                      setIsPopoverOpen(false); // Close popover after getting description
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Button
              className="rounded-xl p-2 h-fit border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 bg-transparent"
              onClick={(event) => {
                event.preventDefault();
                setShowAudioRecorder(true);
              }}
              variant="outline"
              disabled={isLoading}
            >
              <Mic size={18} className="text-zinc-500 dark:text-zinc-400" />
            </Button>

            <Button
              className="rounded-xl p-2 h-fit border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 bg-transparent"
              onClick={(event) => {
                event.preventDefault();
                fileInputRef.current?.click();
              }}
              variant="outline"
              disabled={isLoading}
            >
              <Paperclip size={18} className="text-zinc-500 dark:text-zinc-400" />
            </Button>
          </>
        )}

        <Button
          className="rounded-xl p-2 h-fit bg-red-500 hover:bg-red-600 text-white"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
          style={{ display: isLoading ? 'flex' : 'none' }}
        >
          <StopIcon size={18} />
        </Button>

        {!showAudioRecorder && (
          <Button
            className="rounded-xl p-2 h-fit bg-primary text-white shadow-md shadow-blue-500/20"
            onClick={(event) => {
              event.preventDefault();
              submitForm();
            }}
            disabled={input.length === 0 || uploadQueue.length > 0}
            style={{ display: isLoading ? 'none' : 'flex' }}
          >
            <ArrowUpIcon size={18} />
          </Button>
        )}
      </div>

    </div>
  );
}
