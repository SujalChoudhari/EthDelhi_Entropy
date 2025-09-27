"use client";

import { motion } from "framer-motion";
import { Video, Clock, ArrowUpRight } from "lucide-react";

type SupportCallButtonProps = {
    supportUrl?: string;
    reason?: string;
    isLoading?: boolean;
};

export function SupportCallButton({
    supportUrl = `https://chat.1410inc.xyz/?room=${Math.floor(Math.random() * 100000)}`,
    reason = "Customer Support",
    isLoading = false
}: SupportCallButtonProps) {
    // Display loading skeleton if in loading state
    if (isLoading) {
        return (
            <div className="w-full max-w-md p-4 border rounded-lg bg-background/50 animate-pulse">
                <div className="h-10 bg-muted rounded"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="w-full max-w-md p-5 border rounded-lg shadow-sm bg-background dark:bg-zinc-800/90 border-zinc-100 dark:border-zinc-800"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <h3 className="text-lg font-medium mb-1">Customer Support</h3>
            {reason && reason !== "Customer Support" && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    Reason: {reason}
                </p>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                        Expected wait time: ~2 minutes
                    </span>
                </div>
            </div>

            <motion.a
                href={supportUrl}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-md bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Video size={20} />
                <span className="font-medium">Start Video Call with Support</span>
                <ArrowUpRight size={16} className="ml-1" />
            </motion.a>

            <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                Available Monday-Friday, 9AM-8PM ET
            </div>
        </motion.div>
    );
}