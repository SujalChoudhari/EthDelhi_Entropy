"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

// @ts-ignore
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
