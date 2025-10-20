import React from "react";
import type { CalculationResults } from "../types";
import { MetricsCards } from "./results/MetricsCards";
import { TimelineChart } from "./results/TimelineChart";
import { ScenariosTable } from "./results/ScenariosTable";
import { DeadlineCountdownCard } from "./results/DeadlineCountdownCard";

interface ResultsDisplayProps {
  results: CalculationResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { requiredSlotsPerWeek, timelineScenarios } = results;

  const isFeasible = isFinite(requiredSlotsPerWeek) && requiredSlotsPerWeek > 0;
  const recommendedSlots = isFeasible ? Math.ceil(requiredSlotsPerWeek) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
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
