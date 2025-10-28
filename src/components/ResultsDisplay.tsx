import React from "react";
import type { CalculationResults } from "../types";
import { MetricsCards } from "./results/MetricsCards";
import { TimelineChart } from "./results/TimelineChart";
import { ScenariosTable } from "./results/ScenariosTable";
import { DeadlineCountdownCard } from "./results/DeadlineCountdownCard";
import { User } from "lucide-react";

interface ResultsDisplayProps {
  results: CalculationResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { requiredSlotsPerWeek, timelineScenarios, inputs } = results;

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
      </div>

      <TimelineChart
        results={results}
        recommendedSlots={recommendedSlots}
        isFeasible={isFeasible}
      />

      <DeadlineCountdownCard results={results} />

      <MetricsCards
        results={results}
        isFeasible={isFeasible}
        recommendedSlots={recommendedSlots}
      />

      <ScenariosTable
        timelineScenarios={timelineScenarios}
        recommendedSlots={recommendedSlots}
      />
    </div>
  );
}
