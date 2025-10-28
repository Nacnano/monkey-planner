import React from "react";
import { Clock } from "lucide-react";
import type { CalculationResults } from "../../types";
import { formatNumber, formatDate } from "../../utils/formatters";

interface DeadlineCountdownCardProps {
  results: CalculationResults;
}

export function DeadlineCountdownCard({ results }: DeadlineCountdownCardProps) {
  const { inputs, examDeadlines } = results;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-amber-100 rounded-full mr-4">
          <Clock className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">นับถอยหลังถึงวันสอบ</h3>
      </div>
      <div className="space-y-4">
        {examDeadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="font-bold text-gray-800 flex items-center text-base">
                {deadline.examName}
                {deadline.id === inputs.finalGoalCourseId && (
                  <span className="ml-2 text-amber-500" title="เป้าหมายสุดท้าย">
                    ⭐
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(deadline.date, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-2xl font-extrabold text-amber-600">
                {formatNumber(deadline.daysRemaining)}
              </p>
              <p className="text-xs text-gray-500 -mt-1">วันที่เหลือ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
