"use client";
import React from "react";
import { motion } from "framer-motion"; // Using framer-motion as used elsewhere
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  // Gradients will be determined by theme, remove props
  className?: string; // Added className prop
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

export const Spotlight = ({
  className,
  translateY = -350, // Default values from original
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps = {}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Define gradients based on theme
  // Dark mode: Subtle saturated blue
  // Light mode: Subtle lighter, saturated blue (closer to typical primary)
  const baseHue = isDark ? 210 : 210; // Keep hue blue for both
  const baseSat = isDark ? 100 : 80; // High saturation for dark, slightly less for light
  const baseLight = isDark ? 85 : 75; // Very light base for dark, lighter base for light
  const alpha1 = isDark ? 0.08 : 0.06; // Keep alpha low, slightly higher for light
  const alpha2 = isDark ? 0.02 : 0.02; // Keep alpha low

  // Calculate gradient strings (these adjust based on baseLight)
  const gradientFirst = `radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(${baseHue}, ${baseSat}%, ${baseLight}%, ${alpha1}) 0, hsla(${baseHue}, ${baseSat}%, ${baseLight - 30}%, ${alpha2}) 50%, hsla(${baseHue}, ${baseSat}%, ${baseLight - 40}%, 0) 80%)`;
  const gradientSecond = `radial-gradient(50% 50% at 50% 50%, hsla(${baseHue}, ${baseSat}%, ${baseLight}%, ${alpha1 * 0.75}) 0, hsla(${baseHue}, ${baseSat}%, ${baseLight - 30}%, ${alpha2}) 80%, transparent 100%)`;
  const gradientThird = `radial-gradient(50% 50% at 50% 50%, hsla(${baseHue}, ${baseSat}%, ${baseLight}%, ${alpha1 * 0.5}) 0, hsla(${baseHue}, ${baseSat}%, ${baseLight - 40}%, ${alpha2}) 80%, transparent 100%)`;


  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
        delay: 0.5, // Add a small delay
      }}
      // Ensure it's behind content (z-0) and covers the area
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden",
         className
      )}
    >
      {/* Left Spotlight */}
      <motion.div
        animate={{
          x: [0, xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        // Use w-full h-full instead of w-screen h-screen
        className="absolute top-0 left-0 h-full w-full pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0`}
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />
      </motion.div>

      {/* Right Spotlight */}
      <motion.div
        animate={{
          x: [0, -xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
         // Use w-full h-full instead of w-screen h-screen
        className="absolute top-0 right-0 h-full w-full pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0`}
        />
        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />
        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />
      </motion.div>
    </motion.div>
  );
};

export const GridBackground = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Dynamically set stroke color based on theme
  const strokeColor = isDark ? "rgb(255 255 255 / 0.03)" : "rgb(0 0 0 / 0.03)"; // Made slightly more subtle
  const svgDataUrl = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${encodeURIComponent(strokeColor)}'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      // Ensure it's behind content (z-0) and covers the area
      className={cn("absolute inset-0 z-0 h-full w-full", className)}
      style={{
        backgroundImage: `url("${svgDataUrl}")`,
        backgroundPosition: "center", // Center the pattern
      }}
    />
  );
};

// Optional: Combine them into a single component for easier use
export const SpotlightBackground = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <GridBackground />
      <Spotlight />
      <div className="relative z-10"> {/* Content goes above */}
        {children}
      </div>
    </div>
  );
}; 