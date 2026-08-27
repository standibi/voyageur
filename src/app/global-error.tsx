/* eslint-disable */
"use client";

import { useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="h-screen w-screen overflow-hidden flex bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">A critical error occurred!</h2>
              <p className="text-slate-500 mb-6">
                We encountered an unexpected error. Please try again.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => reset()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i>
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                <i className="fa-solid fa-house mr-2"></i>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
