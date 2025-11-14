import React from "react";
import type { CalculationResults, TimelineAnalysis } from "../../types";
import { CalendarDays } from "lucide-react";
import { formatNumber, formatDate } from "../../utils/formatters";

interface ScenariosTableProps {
  results: CalculationResults;
  recommendedSlots: number;
}

export function ScenariosTable({
  results,
  recommendedSlots,
}: ScenariosTableProps) {
  const { timelineScenarios, examDeadlines } = results;

  // Get latest deadline (max daysRemaining)
  const maxDeadlineDays = Math.max(
    0,
    ...examDeadlines.map((d) => d.daysRemaining)
  );

  // Helper to render small +/- diff badge
  const renderDiffBadge = (diff: number) => {
    const isPositive = diff >= 0;
    const cls = isPositive
      ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2"
      : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2";
    const sign = diff > 0 ? "+" : diff < 0 ? "-" : "+";
    return (
      <span className={cls}>
        <svg
          className={`-ml-0.5 mr-1 h-2 w-2 ${isPositive ? "text-green-400" : "text-red-400"}`}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx="4" cy="4" r="3" />
        </svg>
        {sign}
        {formatNumber(Math.abs(diff), 0)}
      </span>
    );
  };

  const getRowClass = (scenario: TimelineAnalysis, index: number): string => {
    const isRecommended = scenario.slotsPerWeek === recommendedSlots;
    if (isRecommended) {
      return "!bg-sky-100 font-bold text-sky-800";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 print-card">
      <div className="mb-4">
        <h3 className="flex items-center text-xl font-bold text-gray-800">
          <CalendarDays className="h-6 w-6 mr-3 text-indigo-500 no-print" />
          ตารางจำนวน Slot และค่าเรียน / เดือน
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">
                Slot / สัปดาห์
              </th>
              {examDeadlines.map((deadline) => (
                <th
                  key={deadline.id}
                  scope="col"
                  className="px-6 py-3 text-center"
                >
                  <div className="flex flex-col items-center">
                    <span>{deadline.examName}</span>
                    <span className="text-xs font-normal text-gray-500">
                      (
                      {formatDate(deadline.date, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      )
                    </span>
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                บรรลุทุกเป้าหมาย?
              </th>
              <th scope="col" className="px-6 py-3">
                จำนวนเดือนทั้งหมดที่ใช้เรียน
              </th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">
                ค่าเรียน / เดือน
              </th>
            </tr>
          </thead>
          <tbody>
            {timelineScenarios.map((s, index) => (
              <tr
                key={s.slotsPerWeek}
                className={`border-b border-gray-100 transition-colors ${getRowClass(
                  s,
                  index
                )}`}
              >
                <th scope="row" className="px-6 py-4 whitespace-nowrap">
                  {s.slotsPerWeek}
                </th>
                {examDeadlines.map((deadline) => {
                  const successStatus = s.deadlineSuccess.find(
                    (ds) => ds.deadlineId === deadline.id
                  );
                  const isDeadlineMet = successStatus
                    ? successStatus.isSuccess
                    : false;
                  return (
                    <td key={deadline.id} className="px-6 py-4 text-center">
                      {isDeadlineMet ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg
                            className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          ใช่
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <svg
                            className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          ไม่
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-4">
                <div className="flex items-center whitespace-nowrap">
                  {examDeadlines.every((deadline) =>
                    s.deadlineSuccess.some(
                      (ds) => ds.deadlineId === deadline.id && ds.isSuccess
                    )
                  ) ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg
                        className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      ใช่
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <svg
                        className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      ไม่
                    </span>
                  )}
                  {renderDiffBadge(Math.round(maxDeadlineDays - s.daysToFinish))}
                </div>
                </td>
                <td className="px-6 py-4">
                  {isFinite(s.monthsToFinish)
                    ? formatNumber(s.monthsToFinish, 1)
                    : "N/A"}
                </td>
                <td className="px-6 py-4">฿{formatNumber(s.monthlyFee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
