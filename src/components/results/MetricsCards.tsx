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
  const { inputs, totalSheets, totalFee, recommendedPlan, finalGoalCourseId } =
    results;

  const finalGoalCourse = inputs.courses.find(
    (c) => c.id === finalGoalCourseId
  );
  const finalGoalName = finalGoalCourse?.examName || "เป้าหมายสุดท้าย";

  const recommendation = {
    slots: recommendedSlots,
    message: isFeasible
      ? `นี่คือจำนวนคาบเรียนที่เหมาะสมที่สุดเพื่อให้เรียนจบทุกคอร์สทันเวลาสำหรับ '${finalGoalName}'`
      : `ไม่สามารถเรียนจบได้ทันตามกำหนดเวลาของ '${finalGoalName}'`,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recommendation Card */}
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col print-card">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-sky-100 rounded-full mr-4 no-print">
            <Award className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">คำแนะนำ</h3>
        </div>
        <p className="text-5xl font-extrabold text-sky-600">
          {isFeasible ? recommendation.slots : "N/A"}
        </p>
        <p className="text-lg font-medium text-gray-500 -mt-1">คาบ/สัปดาห์</p>
        <p className="mt-4 text-gray-600 text-sm flex-grow">
          {recommendation.message}
        </p>
      </div>

      {/* Budget Card */}
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 print-card">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-emerald-100 rounded-full mr-4 no-print">
            <Wallet className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">งบประมาณ</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">จำนวนชีททั้งหมด</span>
            <p className="text-lg font-bold text-gray-800">
              {formatNumber(totalSheets)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ค่าใช้จ่ายรายเดือน (ประมาณ)</span>
            <p className="text-lg font-bold text-gray-800">
              ฿{formatNumber(recommendedPlan.monthlyFee)}
            </p>
          </div>
          <div className="flex justify-between items-center border-t pt-3 mt-3">
            <span className="text-gray-600 font-bold">ค่าใช้จ่ายทั้งหมด</span>
            <p className="text-3xl font-extrabold text-emerald-600">
              ฿{formatNumber(totalFee)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
