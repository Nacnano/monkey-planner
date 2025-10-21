import React from "react";
import { Award, Wallet } from "lucide-react";
import type { CalculationResults } from "../../types";
import { formatNumber } from "../../utils/formatters";

interface MetricsCardsProps {
  results: CalculationResults;
  isFeasible: boolean;
  recommendedSlots: number;
}

export function MetricsCards({
  results,
  isFeasible,
  recommendedSlots,
}: MetricsCardsProps) {
  const { inputs, totalSheets, totalFee, recommendedPlan } = results;
  const finalGoalName =
    inputs.exams.find((e) => e.id === inputs.finalGoalExamId)?.name ||
    "the final goal";

  const recommendation = {
    slots: recommendedSlots,
    message: isFeasible
      ? `This is the optimal pace to finish all coursework right on time for the '${finalGoalName}' deadline.`
      : `The deadline for '${finalGoalName}' is not feasible.`,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recommendation Card */}
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-sky-100 rounded-full mr-4">
            <Award className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Recommendation</h3>
        </div>
        <p className="text-5xl font-extrabold text-sky-600">
          {isFeasible ? recommendation.slots : "N/A"}
        </p>
        <p className="text-lg font-medium text-gray-500 -mt-1">Slots/Week</p>
        <p className="mt-4 text-gray-600 text-sm flex-grow">
          {recommendation.message}
        </p>
      </div>

      {/* Budget Card */}
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-emerald-100 rounded-full mr-4">
            <Wallet className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Budget</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Sheets</span>
            <p className="text-lg font-bold text-gray-800">
              {formatNumber(totalSheets)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Est. Monthly Cost</span>
            <p className="text-lg font-bold text-gray-800">
              ฿{formatNumber(recommendedPlan.monthlyFee)}
            </p>
          </div>
          <div className="flex justify-between items-center border-t pt-3 mt-3">
            <span className="text-gray-600 font-bold">Total Fee</span>
            <p className="text-3xl font-extrabold text-emerald-600">
              ฿{formatNumber(totalFee)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
