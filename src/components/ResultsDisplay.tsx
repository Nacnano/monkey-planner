import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { CalculationResults } from "../types";
import {
  CheckCircle2,
  XCircle,
  Target,
  Wallet,
  BarChart2,
  CalendarDays,
} from "lucide-react";

interface ResultsDisplayProps {
  results: CalculationResults;
}

const formatNumber = (num: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(num);

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const {
    inputs,
    daysTillDeadline,
    requiredSlotsPerWeek,
    totalFee,
    preferredPlan,
    timelineScenarios,
  } = results;

  const summary = {
    isSuccess: preferredPlan.isSuccess,
    title: preferredPlan.isSuccess
      ? `เรียนทันใน ${formatNumber(preferredPlan.daysToFinish)} วัน!`
      : `เรียนไม่ทันตามกำหนด`,
    message: preferredPlan.isSuccess
      ? `ด้วยการเรียน ${inputs.preferredSlots} ครั้ง/สัปดาห์ น้อง ${
          inputs.studentNickname
        } จะเรียนจบก่อนเดดไลน์ ${formatNumber(
          daysTillDeadline - preferredPlan.daysToFinish
        )} วัน`
      : `ต้องใช้เวลาเรียน ${formatNumber(
          preferredPlan.daysToFinish
        )} วัน ซึ่งเกินเดดไลน์ไป ${formatNumber(
          preferredPlan.daysToFinish - daysTillDeadline
        )} วัน`,
  };

  const recommendation = {
    slots: Math.ceil(requiredSlotsPerWeek),
    message: `เพื่อที่จะเรียนให้ทันเดดไลน์ (${formatNumber(
      daysTillDeadline
    )} วัน) น้อง ${inputs.studentNickname} ควรเรียนอย่างน้อย ${Math.ceil(
      requiredSlotsPerWeek
    )} ครั้ง/สัปดาห์`,
  };

  return (
    <div className="space-y-8">
      <div
        className={`p-6 rounded-xl shadow-lg border ${
          summary.isSuccess
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center">
          {summary.isSuccess ? (
            <CheckCircle2 className="h-8 w-8 text-green-600 mr-4" />
          ) : (
            <XCircle className="h-8 w-8 text-red-600 mr-4" />
          )}
          <div>
            <h2
              className={`text-2xl font-bold ${
                summary.isSuccess ? "text-green-800" : "text-red-800"
              }`}
            >
              {summary.title}
            </h2>
            <p
              className={`mt-1 ${
                summary.isSuccess ? "text-green-700" : "text-red-700"
              }`}
            >
              {summary.message}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-md border border-slate-200">
          <h3 className="flex items-center text-lg font-semibold text-slate-700 mb-4">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            คำแนะนำ (Recommendation)
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {recommendation.slots}{" "}
            <span className="text-lg font-normal text-slate-600">
              ครั้ง/สัปดาห์
            </span>
          </p>
          <p className="mt-2 text-slate-600">{recommendation.message}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md border border-slate-200">
          <h3 className="flex items-center text-lg font-semibold text-slate-700 mb-4">
            <Wallet className="h-5 w-5 mr-2 text-emerald-500" />
            สรุปค่าใช้จ่าย (Budget)
          </h3>
          <div className="flex justify-between items-baseline">
            <span className="text-slate-600">ค่าเรียนทั้งหมด</span>
            <p className="text-3xl font-bold text-emerald-600">
              ฿{formatNumber(totalFee)}
            </p>
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-slate-600">ค่าเรียน/เดือน (ตามแผน)</span>
            <p className="text-xl font-semibold text-emerald-600">
              ฿{formatNumber(preferredPlan.monthlyFee)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md border border-slate-200">
        <h3 className="flex items-center text-lg font-semibold text-slate-700 mb-4">
          <BarChart2 className="h-5 w-5 mr-2 text-purple-500" />
          Timeline Visualization
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={timelineScenarios.slice(0, 10)}
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                label={{
                  value: "Days to Finish",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="category"
                dataKey="slotsPerWeek"
                label={{
                  value: "Slots per Week",
                  angle: -90,
                  position: "insideLeft",
                }}
                width={80}
              />
              <Tooltip
                formatter={(value) => `${formatNumber(Number(value))} days`}
                labelFormatter={(label) => `${label} slots/week`}
              />
              <Legend verticalAlign="top" />
              <ReferenceLine
                x={daysTillDeadline}
                label={{
                  value: `Deadline`,
                  position: "insideTopRight",
                  fill: "#dc2626",
                }}
                stroke="#dc2626"
                strokeDasharray="4 4"
              />
              <Bar
                dataKey="daysToFinish"
                name="Days to Finish"
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md border border-slate-200">
        <h3 className="flex items-center text-lg font-semibold text-slate-700 mb-4">
          <CalendarDays className="h-5 w-5 mr-2 text-indigo-500" />
          Timeline Scenarios
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Slots / Week
                </th>
                <th scope="col" className="px-6 py-3">
                  Days to Finish
                </th>
                <th scope="col" className="px-6 py-3">
                  On Time?
                </th>
                <th scope="col" className="px-6 py-3">
                  Fee / Month
                </th>
              </tr>
            </thead>
            <tbody>
              {timelineScenarios.map((s) => (
                <tr
                  key={s.slotsPerWeek}
                  className={`border-b ${
                    s.slotsPerWeek === inputs.preferredSlots
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap"
                  >
                    {s.slotsPerWeek}
                  </th>
                  <td className="px-6 py-4">
                    {isFinite(s.daysToFinish)
                      ? formatNumber(s.daysToFinish, 1)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        s.isSuccess
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.isSuccess ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4">฿{formatNumber(s.monthlyFee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
