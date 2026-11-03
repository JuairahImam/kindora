"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client error captured:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-theme-bg">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/10">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-500">
            Application Notice
          </span>
          <h1 className="text-3xl font-extrabold text-theme-heading tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-theme-body text-sm leading-relaxed max-w-sm mx-auto">
            We encountered an unexpected error while loading this view. You can try refreshing the component or return to the main dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto h-11 px-6 text-sm font-bold gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary w-full sm:w-auto h-11 px-6 text-sm font-bold gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
