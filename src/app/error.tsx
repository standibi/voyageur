"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
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
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-slate-50 text-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
          <p className="text-slate-500 mb-6">
            We encountered an unexpected error. Please try again or go back to the homepage.
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
  );
}
