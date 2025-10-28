import React from "react";
import type { CalculationResults } from "../types";
import { MetricsCards } from "./results/MetricsCards";
import { TimelineChart } from "./results/TimelineChart";
import { ScenariosTable } from "./results/ScenariosTable";
import { DeadlineCountdownCard } from "./results/DeadlineCountdownCard";
import { User, Printer } from "lucide-react";

interface ResultsDisplayProps {
  results: CalculationResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { requiredSlotsPerWeek, inputs } = results;

  const isFeasible = isFinite(requiredSlotsPerWeek) && requiredSlotsPerWeek > 0;
  const recommendedSlots = isFeasible ? Math.ceil(requiredSlotsPerWeek) : 0;

  const { studentName, studentNickname, studentGoal } = inputs;

  const studentDisplayName =
    studentName && studentNickname
      ? `${studentName} (${studentNickname})`
      : studentNickname || "นักเรียน";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 rounded-full">
              <User className="h-8 w-8 text-sky-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                แผนการเรียนสำหรับ {studentDisplayName}
              </h2>
              <div className="mt-1">
                {studentGoal && (
                  <p className="text-gray-500">
                    เป้าหมาย:{" "}
                    <span className="font-semibold text-gray-700">
                      {studentGoal}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            <Printer className="h-4 w-4" />
            พิมพ์แผนการเรียน
          </button>
        </div>
      </div>

      <DeadlineCountdownCard results={results} />

      <TimelineChart
        results={results}
        recommendedSlots={recommendedSlots}
        isFeasible={isFeasible}
      />

      <MetricsCards
        results={results}
        isFeasible={isFeasible}
        recommendedSlots={recommendedSlots}
      />

      <ScenariosTable results={results} recommendedSlots={recommendedSlots} />
    </div>
  );
}
