import React from "react";
import { Clock } from "lucide-react";
import type { CalculationResults } from "../../types";

interface DeadlineCountdownCardProps {
  results: CalculationResults;
}

const formatNumber = (num: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(num);

const formatDate = (dateString: string) => {
  if (!dateString || !dateString.includes("-")) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export function DeadlineCountdownCard({ results }: DeadlineCountdownCardProps) {
  const { inputs, examDeadlines } = results;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-amber-100 rounded-full mr-4">
          <Clock className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Deadline Countdown</h3>
      </div>
      <div className="space-y-4">
        {examDeadlines.map((deadline) => (
          <div
            key={deadline.examName}
            className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="font-bold text-gray-800 flex items-center text-base">
                {deadline.examName}
                {deadline.id === inputs.finalGoalExamId && (
                  <span className="ml-2 text-amber-500" title="Final Goal">
                    ⭐
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(deadline.date)}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-2xl font-extrabold text-amber-600">
                {formatNumber(deadline.daysRemaining)}
              </p>
              <p className="text-xs text-gray-500 -mt-1">days remaining</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
