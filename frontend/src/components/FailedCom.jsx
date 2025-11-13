import React from "react";

export default function FailedCom({ message = "Failed to fetch data", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      {/* Circle Icon */}
      <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856C19.07 19 20 18.07 20 16.938V7.062C20 5.93 19.07 5 17.938 5H6.062C4.93 5 4 5.93 4 7.062v9.876C4 18.07 4.93 19 6.062 19z" />
        </svg>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">{message}</p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-400 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
