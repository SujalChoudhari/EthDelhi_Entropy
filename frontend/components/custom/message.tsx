"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import { AccountBalance } from "../bank/account-balance";
import { Bot, User } from "lucide-react";
import { TransferMoney } from "../bank/transfer-money";
import { BankAppointment } from "../bank/bank-appointment";
import { StrategyCreator } from "../strategy/strategy-creator";
import { StrategyRecommender } from "../strategy/strategy-recommender";

export const Message = ({
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      className={`flex flex-row gap-3 px-4 w-full md:w-[850px] md:px-0 first-of-type:pt-20 mb-4`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={`shrink-0 mt-1 ${isAssistant ? "order-first" : "order-first md:order-last"}`}>
        <div className={`size-[36px] flex items-center justify-center rounded-full 
          ${isAssistant 
            ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md shadow-blue-500/20" 
            : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"}`}
        >
          {isAssistant ? <Bot size={20} /> : <User size={20} />}
        </div>
      </div>

      <div className={`flex flex-col gap-2 w-full ${isAssistant ? "items-start" : "items-end"}`}>
        {content && typeof content === "string" && (
          <motion.div 
            className={`text-zinc-800 dark:text-zinc-200 px-4 py-3 rounded-2xl max-w-[90%]
              ${isAssistant 
                ? "bg-white dark:bg-zinc-800/90 shadow-sm dark:shadow-none border border-zinc-100 dark:border-zinc-800 rounded-tl-sm" 
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 dark:shadow-emerald-800/10 rounded-tr-sm"}`}
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Markdown>{content}</Markdown>
          </motion.div>
        )}

        {toolInvocations && (
          <div className={`flex flex-col gap-4 max-w-[90%] ${!isAssistant && "items-end"}`}>
            {toolInvocations.map((toolInvocation, index) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <motion.div 
                    key={`tool-${toolCallId}-${index}`}
                    className=" dark:shadow-zinc-900/30"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {toolName === "getWeather" ? (
                      <Weather weatherAtLocation={result} />
                    ) : toolName === "checkAccountBalance" ? (
                      <AccountBalance balanceData={result} />
                    ) : toolName === "transferMoney" ? (
                      <TransferMoney transferData={result} />
                    ) : toolName === "scheduleAppointment" ? (
                      <BankAppointment appointmentData={result} />
                    ) : toolName === "createTradingStrategy" ? (
                      <StrategyCreator strategyData={result} />
                    ) : toolName === "getStrategyRecommendations" ? (
                      <StrategyRecommender 
                        recommendationData={result}
                        onInvest={(strategyId: string) => console.log(`Investing in: ${strategyId}`)}
                      />
                    ) : (
                      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg">
                        {JSON.stringify(result, null, 2)}
                      </div>
                    )}
                  </motion.div>
                );
              } else {
                return (
                  <motion.div 
                    key={`skeleton-${toolCallId}-${index}`}
                    className="skeleton w-full rounded-lg overflow-hidden shadow-sm dark:shadow-zinc-900/30"
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ 
                      scale: [0.95, 1, 0.98, 1],
                      opacity: [0.7, 0.8, 0.9, 0.7],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  >
                    {toolName === "getWeather" ? (
                      <Weather />
                    ) : toolName === "checkAccountBalance" ? (
                      <AccountBalance />
                    ) : toolName === "transferMoney" ? (
                      <TransferMoney />
                    ) : toolName === "scheduleAppointment" ? (
                      <BankAppointment />
                    ) : toolName === "createTradingStrategy" ? (
                      <StrategyCreator />
                    ) : toolName === "getStrategyRecommendations" ? (
                      <div className="space-y-4">
                        <div className="h-16 bg-muted/70 animate-pulse rounded-lg" />
                        <div className="h-32 bg-muted/70 animate-pulse rounded-lg" />
                        <div className="h-24 bg-muted/70 animate-pulse rounded-lg" />
                      </div>
                    ) : <div className="h-20 bg-muted/70 animate-pulse rounded-lg" />}
                  </motion.div>
                );
              }
            })}
          </div>
        )}

        {attachments && (
          <div className="flex flex-row gap-2 mt-1">
            {attachments.map((attachment, index) => (
              <motion.div
                key={`attachment-${attachment.url}-${index}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <PreviewAttachment attachment={attachment} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
