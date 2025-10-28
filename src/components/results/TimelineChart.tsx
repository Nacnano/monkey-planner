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
import type { CalculationResults } from "../../types";
import { BarChart2 } from "lucide-react";
import {
  formatNumber,
  formatDate,
  formatDaysToDate,
} from "../../utils/formatters";

const COURSE_COLORS = [
  "#0ea5e9",
  "#10b981",
  "#a855f7",
  "#f97316",
  "#ec4899",
  "#f59e0b",
  "#14b8a6",
];
const DEADLINE_COLORS = ["#ef4444", "#d946ef", "#0891b2", "#84cc16"];

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
        <p className="font-bold text-gray-800 mb-2">{`คาบ/สัปดาห์: ${label}`}</p>
        <ul className="list-none p-0 space-y-1">
          {payload.map((entry, index) => (
            <li
              key={`item-${index}`}
              style={{ color: entry.color }}
              className="flex justify-between items-center"
            >
              <span className="font-medium">{entry.name}:</span>
              <span className="font-bold ml-4">
                {formatNumber(entry.value || 0, 1)} วัน
              </span>
            </li>
          ))}
        </ul>
        <p className="font-extrabold text-gray-900 border-t border-gray-200 mt-2 pt-2 flex justify-between">
          <span>รวม:</span>
          <span>{formatNumber(total, 1)} วัน</span>
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

interface TimelineChartProps {
  results: CalculationResults;
  recommendedSlots: number;
  isFeasible: boolean;
}

export function TimelineChart({
  results,
  recommendedSlots,
  isFeasible,
}: TimelineChartProps) {
  const { inputs, timelineScenarios, examDeadlines } = results;

  const [minSlotRange, setMinSlotRange] = useState(1);
  const [maxSlotRange, setMaxSlotRange] = useState(7);

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

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="flex items-center text-xl font-bold text-gray-800">
          <BarChart2 className="h-6 w-6 mr-3 text-violet-500" />
          ภาพรวมแผนการเรียน
        </h3>
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          <label htmlFor="minSlots" className="font-medium text-gray-600">
            ช่วงคาบเรียน:
          </label>
          <input
            type="number"
            id="minSlots"
            value={minSlotRange}
            onChange={(e) =>
              setMinSlotRange(Math.max(1, Number(e.target.value)))
            }
            min="1"
            max={maxSlotRange - 1}
            className="w-16 p-1 text-center bg-gray-100 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            aria-label="จำนวนคาบเรียนขั้นต่ำต่อสัปดาห์"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            id="maxSlots"
            value={maxSlotRange}
            onChange={(e) => setMaxSlotRange(Number(e.target.value))}
            min={minSlotRange + 1}
            max="7"
            className="w-16 p-1 text-center bg-gray-100 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            aria-label="จำนวนคาบเรียนสูงสุดต่อสัปดาห์"
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
                value: "จำนวนวันที่ต้องใช้",
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
                value: "คาบเรียนต่อสัปดาห์",
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
                ? "#f59e0b"
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
                        deadline.date,
                        { day: "numeric", month: "short" }
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
  );
}
