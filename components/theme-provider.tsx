"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";


import { Button } from "@/components/ui/button";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from "next-themes";

interface ThemeProviderProps extends NextThemeProviderProps {
  children: React.ReactNode;
}


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Theme set to ${newTheme} mode`,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <div className="relative">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
