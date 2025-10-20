import React, { useState, useEffect } from "react";
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
import type { CalculationResults, TimelineAnalysis } from "../types";
import {
  CheckCircle2,
  XCircle,
  Wallet,
  BarChart2,
  CalendarDays,
  Clock,
  Award,
  SlidersHorizontal,
} from "lucide-react";

interface ResultsDisplayProps {
  results: CalculationResults;
}

const formatNumber = (num: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(num);

const formatDate = (dateString: string) => {
  if (!dateString || !dateString.includes("-")) return "";
  const date = new Date(dateString + "T00:00:00"); // Ensure date is parsed in local timezone
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const formatDaysToDate = (days: number): string => {
  if (typeof days !== "number" || !isFinite(days) || days < 0) return "";
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return futureDate.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
};

const COURSE_COLORS = [
  "#0ea5e9",
  "#10b981",
  "#a855f7",
  "#f97316",
  "#ec4899",
  "#f59e0b",
  "#14b8a6",
]; // sky, emerald, violet, orange, pink, amber, teal
const DEADLINE_COLORS = ["#ef4444", "#d946ef", "#0891b2", "#84cc16"]; // red, fuchsia, cyan, lime

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-xl text-sm">
        <p className="font-bold text-gray-800 mb-2">{`Slots/Week: ${label}`}</p>
        <ul className="list-none p-0 space-y-1">
          {payload.map((entry, index) => (
            <li
              key={`item-${index}`}
              style={{ color: entry.color }}
              className="flex justify-between items-center"
            >
              <span className="font-medium">{entry.name}:</span>
              <span className="font-bold ml-4">
                {formatNumber(entry.value || 0, 1)} days
              </span>
            </li>
          ))}
        </ul>
        <p className="font-extrabold text-gray-900 border-t border-gray-200 mt-2 pt-2 flex justify-between">
          <span>Total:</span>
          <span>{formatNumber(total, 1)} days</span>
        </p>
      </div>
    );
  }
  return null;
};

interface DeadlineLabelProps {
  viewBox?: { x?: number; y?: number };
  value: string;
  dy: number;
  fill: string;
  isFinalGoal?: boolean;
}

const DeadlineLabelWithArrow = (props: DeadlineLabelProps) => {
  const { viewBox, value, dy, fill, isFinalGoal } = props;
  if (!viewBox || !viewBox.x || !viewBox.y) return null;
  const { x, y } = viewBox;

  const textY = y + dy;
  const lineStartY = textY + 5;
  const lineEndY = y - 2;
  const arrowSize = 4;

  return (
    <g>
      <text
        x={x}
        y={textY}
        dy={-4}
        fill={fill}
        fontSize={isFinalGoal ? 14 : 12}
        fontWeight={isFinalGoal ? "extrabold" : "bold"}
        textAnchor="middle"
      >
        {isFinalGoal ? `⭐ ${value}` : value}
      </text>
      <path
        d={`M${x},${lineStartY} L${x},${lineEndY} M${x - arrowSize},${
          lineEndY - arrowSize
        } L${x},${lineEndY} L${x + arrowSize},${lineEndY - arrowSize}`}
        stroke={fill}
        fill="none"
        strokeWidth={isFinalGoal ? 2 : 1.5}
      />
    </g>
  );
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const {
    inputs,
    totalSheets,
    examDeadlines,
    requiredSlotsPerWeek,
    totalFee,
    recommendedPlan,
    timelineScenarios,
  } = results;
  const finalGoalName =
    inputs.exams.find((e) => e.id === inputs.finalGoalExamId)?.name ||
    "the final goal";

  const isFeasible = isFinite(requiredSlotsPerWeek) && requiredSlotsPerWeek > 0;
  const recommendedSlots = isFeasible ? Math.ceil(requiredSlotsPerWeek) : 0;

  const [minSlotRange, setMinSlotRange] = useState(1);
  const [maxSlotRange, setMaxSlotRange] = useState(10);

  useEffect(() => {
    const focusPoints = [isFeasible ? recommendedSlots : 1];
    const minFocus = Math.min(...focusPoints);
    const maxFocus = Math.max(...focusPoints);

    const range = 5;
    const defaultMin = Math.max(1, minFocus - range);
    const defaultMax = maxFocus + range;

    setMinSlotRange(defaultMin);
    setMaxSlotRange(defaultMax);
  }, [results, recommendedSlots, isFeasible]);

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

  const recommendation = {
    slots: recommendedSlots,
    message: isFeasible
      ? `This is the optimal pace to finish all coursework right on time for the '${finalGoalName}' deadline.`
      : `The deadline for '${finalGoalName}' is not feasible.`,
  };

  const visibleScenarios = timelineScenarios.filter(
    (s) => s.slotsPerWeek >= minSlotRange && s.slotsPerWeek <= maxSlotRange
  );

  const chartData = visibleScenarios.map((scenario) => {
    const scenarioData: { [key: string]: number | string } = {
      slotsPerWeek: scenario.slotsPerWeek,
      totalDays: scenario.daysToFinish,
    };
    scenario.courseBreakdown.forEach((cb) => {
      scenarioData[cb.courseName] = cb.daysToFinish;
    });
    return scenarioData;
  });

  const courses = results.inputs.courses;
  const maxDeadlineDays = Math.max(
    0,
    ...examDeadlines.map((d) => d.daysRemaining)
  );

  const getRowClass = (scenario: TimelineAnalysis, index: number): string => {
    const isRecommended = scenario.slotsPerWeek === recommendedSlots;

    if (isRecommended) {
      return "!bg-sky-100 font-bold text-sky-800";
    }
    return index % 2 === 0 ? "bg-white" : "bg-gray-50";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div
        className={`p-6 rounded-2xl shadow-lg border ${
          summary.isSuccess
            ? "bg-green-100 border-green-300"
            : "bg-red-100 border-red-300"
        }`}
      >
        <div className="flex items-center">
          {summary.isSuccess ? (
            <CheckCircle2 className="h-10 w-10 text-green-600 mr-4 flex-shrink-0" />
          ) : (
            <XCircle className="h-10 w-10 text-red-600 mr-4 flex-shrink-0" />
          )}
          <div>
            <h2
              className={`text-2xl font-extrabold ${
                summary.isSuccess ? "text-green-900" : "text-red-900"
              }`}
            >
              {summary.title}
            </h2>
            <p
              className={`mt-1 text-base ${
                summary.isSuccess ? "text-green-800" : "text-red-800"
              }`}
            >
              {summary.message}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-amber-100 rounded-full mr-4">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Deadline Countdown
            </h3>
          </div>
          <div className="space-y-3">
            {examDeadlines.map((deadline) => (
              <div
                key={deadline.examName}
                className="flex justify-between items-center text-gray-600"
              >
                <span className="flex items-center">
                  {deadline.id === inputs.finalGoalExamId && (
                    <span className="mr-2">⭐</span>
                  )}
                  {deadline.examName}
                </span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-sm">
                  {formatNumber(deadline.daysRemaining)} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="flex items-center text-xl font-bold text-gray-800">
            <BarChart2 className="h-6 w-6 mr-3 text-violet-500" />
            Timeline Visualization
          </h3>
          <div className="flex items-center gap-2 sm:gap-4 text-sm">
            <label htmlFor="minSlots" className="font-medium text-gray-600">
              Slot Range:
            </label>
            <input
              type="number"
              id="minSlots"
              value={minSlotRange}
              onChange={(e) =>
                setMinSlotRange(Math.max(1, Number(e.target.value)))
              }
              min="1"
              className="w-16 p-1 text-center bg-gray-100 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              aria-label="Minimum slots per week"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              id="maxSlots"
              value={maxSlotRange}
              onChange={(e) => setMaxSlotRange(Number(e.target.value))}
              min={minSlotRange + 1}
              className="w-16 p-1 text-center bg-gray-100 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
              aria-label="Maximum slots per week"
            />
          </div>
        </div>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 100, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                horizontal={false}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                domain={[
                  0,
                  (dataMax: number) =>
                    Math.ceil(Math.max(dataMax || 0, maxDeadlineDays) * 1.1),
                ]}
                label={{
                  value: "Days to Finish",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#6b7280",
                }}
                stroke="#9ca3af"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <XAxis
                xAxisId="dateAxis"
                orientation="top"
                type="number"
                dataKey="totalDays"
                domain={[
                  0,
                  (dataMax: number) =>
                    Math.ceil(Math.max(dataMax || 0, maxDeadlineDays) * 1.1),
                ]}
                tickFormatter={formatDaysToDate}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="slotsPerWeek"
                label={{
                  value: "Slots per Week",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#6b7280",
                }}
                width={80}
                stroke="#9ca3af"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(241, 245, 249, 0.7)" }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: "2rem" }}
              />

              {courses.map((course, index) => (
                <Bar
                  key={course.id}
                  dataKey={course.name}
                  stackId="a"
                  name={course.name}
                  fill={COURSE_COLORS[index % COURSE_COLORS.length]}
                />
              ))}

              {examDeadlines.map((deadline, index) => {
                const isFinalGoal = deadline.id === inputs.finalGoalExamId;
                const color = isFinalGoal
                  ? "#f59e0b" // A standout amber/gold color for the final goal
                  : DEADLINE_COLORS[index % DEADLINE_COLORS.length];

                return (
                  <ReferenceLine
                    key={deadline.examName}
                    x={deadline.daysRemaining}
                    stroke={color}
                    strokeDasharray={isFinalGoal ? "3 3" : "4 4"}
                    strokeWidth={isFinalGoal ? 3 : 2}
                    label={
                      <DeadlineLabelWithArrow
                        value={`${deadline.examName} (${formatDate(
                          deadline.date
                        )})`}
                        dy={-(45 + (index % 3) * 25)}
                        fill={color}
                        isFinalGoal={isFinalGoal}
                      />
                    }
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
    </div>
  );
}
