import React from "react";
import type { TimelineAnalysis } from "../../types";
import { CalendarDays } from "lucide-react";
import { formatNumber } from "../../utils/formatters";

interface ScenariosTableProps {
  timelineScenarios: TimelineAnalysis[];
  recommendedSlots: number;
}

export function ScenariosTable({
  timelineScenarios,
  recommendedSlots,
}: ScenariosTableProps) {
  const getRowClass = (scenario: TimelineAnalysis, index: number): string => {
    const isRecommended = scenario.slotsPerWeek === recommendedSlots;
    if (isRecommended) {
      return "!bg-sky-100 font-bold text-sky-800";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
        <CalendarDays className="h-6 w-6 mr-3 text-indigo-500" />
        Plan Scenarios & Breakdown
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">
                Slots / Week
              </th>
              <th scope="col" className="px-6 py-3">
                Total Days to Finish
              </th>
              <th scope="col" className="px-6 py-3">
                Meets Final Goal?
              </th>
              <th scope="col" className="px-6 py-3 rounded-r-lg">
                Fee / Month
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
                <td className="px-6 py-4">
                  {isFinite(s.daysToFinish)
                    ? formatNumber(s.daysToFinish, 1)
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  {s.isSuccess ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg
                        className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 8 8"
                      >
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Yes
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
                      No
                    </span>
                  )}
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
