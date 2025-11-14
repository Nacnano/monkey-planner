import React from "react";
import { Award, Wallet } from "lucide-react";
import type { CalculationResults } from "../../types";
import { formatNumber, formatDaysToDate } from "../../utils/formatters";

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

  // compute total days for recommended plan (use daysToFinish if present, else approximate)
  const totalDays =
    (recommendedPlan && "daysToFinish" in recommendedPlan ? recommendedPlan.daysToFinish : undefined) ??
    Math.round((recommendedPlan?.monthsToFinish ?? 0) * 30);

  // latest deadline (max daysRemaining) and diff vs totalDays
  const maxDeadlineDays = Math.max(
    0,
    ...(results.examDeadlines?.map((d) => d.daysRemaining) ?? [])
  );
  const diffDays = Math.round(maxDeadlineDays - totalDays);
  const finishDateLabel = formatDaysToDate(totalDays);

  // prominent badge for readability (green if >=0, red if <0)
  const renderDiffBadge = (diff: number) => {
    const isPositive = diff >= 0;
    const cls = isPositive
      ? "inline-flex items-center px-4 py-2 rounded-lg text-base font-bold bg-green-100 text-green-800"
      : "inline-flex items-center px-4 py-2 rounded-lg text-base font-bold bg-red-100 text-red-800";
    const sign = diff > 0 ? "+" : diff < 0 ? "-" : "+";
    return (
      <span className={cls} style={{ minWidth: 70, justifyContent: "center" }}>
        <svg
          className={`-ml-1 mr-2.5 h-4 w-4 ${isPositive ? "text-green-400" : "text-red-400"}`}
          fill="currentColor"
          viewBox="0 0 8 8"
          aria-hidden
        >
          <circle cx="4" cy="4" r="3" />
        </svg>
        {sign}
        {formatNumber(Math.abs(diff), 0)}
      </span>
    );
  };

  const finalGoalCourse = inputs.courses.find(
    (c) => c.id === finalGoalCourseId
  );
  const finalGoalName = finalGoalCourse?.examName || "เป้าหมายสุดท้าย";

  const recommendation = {
    slots: recommendedSlots,
    message: isFeasible
      ? `เหมาะสมที่สุด จบทุกคอร์ส ทันเวลา สำหรับ '${finalGoalName}'`
      : `ไม่สามารถเรียนจบได้ทันตาม '${finalGoalName}'`,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recommendation Card */}
      <div className="p-6 bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg border-2 border-sky-200 flex flex-col print-card">
        <div className="flex items-center mb-4">
          <div className="p-2.5 bg-sky-500 rounded-lg mr-3 no-print">
            <Award className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">คำแนะนำ</h3>
        </div>
        <div className="mb-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <p className="text-6xl font-extrabold text-sky-600 leading-none">
                {isFeasible ? recommendation.slots : "N/A"}
              </p>
              <div className="flex flex-col pb-1.5">
                <p className="text-lg font-semibold text-gray-700 leading-tight">
                  Slot / สัปดาห์
                </p>
                <p className="text-sm text-gray-500">({totalSheets} ชีท)</p>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-sm text-gray-600">
                <div className="text-xs text-gray-500">เสร็จวันที่</div>
                <div className="text-xl font-bold text-sky-700">{finishDateLabel}</div>
              </div>
              <div>
                {renderDiffBadge(diffDays)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto pt-3 border-t border-sky-200">
          <p className="text-gray-700 text-sm leading-relaxed">
            {recommendation.message}
          </p>
        </div>
      </div>

      {/* Budget Card */}
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg border-2 border-emerald-200 print-card">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-emerald-500 rounded-lg mr-3 no-print">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-base font-bold text-gray-800">ค่าเรียน</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center p-2.5 bg-white rounded-lg shadow-sm">
            <span className="text-sm text-gray-600 font-medium">
              จำนวนเดือน
            </span>
            <p className="text-lg font-bold text-gray-800">
              {formatNumber(recommendedPlan.monthsToFinish, 1)}
            </p>
          </div>
          <div className="flex justify-between items-center p-2.5 bg-white rounded-lg shadow-sm">
            <span className="text-sm text-gray-600 font-medium">
              ค่าเรียน / เดือน
            </span>
            <p className="text-lg font-bold text-gray-800">
              ฿{formatNumber(recommendedPlan.monthlyFee)}
            </p>
          </div>
          <div className="flex justify-between items-center p-3 bg-emerald-100 rounded-lg border-2 border-emerald-300 mt-3">
            <span className="text-gray-800 font-bold text-sm">
              ค่าใช้จ่ายทั้งหมด
            </span>
            <p className="text-2xl font-extrabold text-emerald-600">
              ฿{formatNumber(totalFee)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
