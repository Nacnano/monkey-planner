import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface SummaryCardProps {
  isSuccess: boolean;
  title: string;
  message: React.ReactNode;
}

export function SummaryCard({ isSuccess, title, message }: SummaryCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg border ${
        isSuccess
          ? "bg-green-100 border-green-300"
          : "bg-red-100 border-red-300"
      }`}
    >
      <div className="flex items-center">
        {isSuccess ? (
          <CheckCircle2 className="h-10 w-10 text-green-600 mr-4 flex-shrink-0" />
        ) : (
          <XCircle className="h-10 w-10 text-red-600 mr-4 flex-shrink-0" />
        )}
        <div>
          <h2
            className={`text-2xl font-extrabold ${
              isSuccess ? "text-green-900" : "text-red-900"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-1 text-base ${
              isSuccess ? "text-green-800" : "text-red-800"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
