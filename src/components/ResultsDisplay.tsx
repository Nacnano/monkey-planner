import React from "react";
import type { CalculationResults } from "../types";
import { SummaryCard } from "./results/SummaryCard";
import { MetricsCards } from "./results/MetricsCards";
import { TimelineChart } from "./results/TimelineChart";
import { ScenariosTable } from "./results/ScenariosTable";

interface ResultsDisplayProps {
  results: CalculationResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { inputs, requiredSlotsPerWeek, timelineScenarios } = results;

  const finalGoalName =
    inputs.exams.find((e) => e.id === inputs.finalGoalExamId)?.name ||
    "the final goal";

  const isFeasible = isFinite(requiredSlotsPerWeek) && requiredSlotsPerWeek > 0;
  const recommendedSlots = isFeasible ? Math.ceil(requiredSlotsPerWeek) : 0;

  const summary = {
    isSuccess: isFeasible,
    title: isFeasible
      ? `On Track for '${finalGoalName}'!`
      : `Goal '${finalGoalName}' is At Risk`,
    message: isFeasible ? (
      <>
        Your recommended plan of{" "}
        <strong className="font-bold">{recommendedSlots} slots/week</strong>{" "}
        puts you on a clear path to success.
      </>
    ) : (
      <>
        The current workload is too high for the deadline.{" "}
        <strong className="font-bold">
          Try reducing sheets or extending the deadline.
        </strong>
      </>
    ),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <SummaryCard
        isSuccess={summary.isSuccess}
        title={summary.title}
        message={summary.message}
      />

      <MetricsCards
        results={results}
        isFeasible={isFeasible}
        recommendedSlots={recommendedSlots}
      />

      <TimelineChart
        results={results}
        recommendedSlots={recommendedSlots}
        isFeasible={isFeasible}
      />

      <ScenariosTable
        timelineScenarios={timelineScenarios}
        recommendedSlots={recommendedSlots}
      />
    </div>
  );
}
