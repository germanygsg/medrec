"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="text-center px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Welcome to BSPCenter Medical Record App
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-in">
            <Button size="lg" className="min-w-[140px]">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline" className="min-w-[140px]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
