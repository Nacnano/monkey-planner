import React from "react";
import type { Exam } from "../types";
import { Trash2 } from "lucide-react";

interface ExamInputProps {
  exam: Exam;
  onUpdate: (id: string, updatedExam: Partial<Exam>) => void;
  onRemove: (id: string) => void;
  isFinalGoal: boolean;
  onSetFinalGoal: (id: string) => void;
}

export function ExamInput({
  exam,
  onUpdate,
  onRemove,
  isFinalGoal,
  onSetFinalGoal,
}: ExamInputProps) {
  return (
    <div
      className={`p-3 border rounded-lg transition-all duration-200 ${
        isFinalGoal
          ? "bg-sky-50 border-sky-300 shadow-md"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <label
            htmlFor={`examName-${exam.id}`}
            className="text-xs font-medium text-gray-500"
          >
            Exam Name*
          </label>
          <input
            type="text"
            id={`examName-${exam.id}`}
            placeholder="e.g. Final Exam"
            value={exam.name}
            onChange={(e) => onUpdate(exam.id, { name: e.target.value })}
            required
            className={`w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500 ${
              isFinalGoal ? "bg-white" : "bg-gray-50"
            }`}
          />
        </div>
        <div className="flex-shrink-0">
          <label
            htmlFor={`examDate-${exam.id}`}
            className="text-xs font-medium text-gray-500"
          >
            Exam Date*
          </label>
          <input
            type="date"
            id={`examDate-${exam.id}`}
            value={exam.date}
            onChange={(e) => onUpdate(exam.id, { date: e.target.value })}
            required
            className={`w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500 ${
              isFinalGoal ? "bg-white" : "bg-gray-50"
            }`}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(exam.id)}
          className="p-2 h-10 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors flex-shrink-0"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3">
        <label
          htmlFor={`finalGoal-${exam.id}`}
          className="flex items-center w-full cursor-pointer p-2 rounded-lg hover:bg-sky-100"
        >
          <input
            type="radio"
            id={`finalGoal-${exam.id}`}
            name="finalGoalExam"
            checked={isFinalGoal}
            onChange={() => onSetFinalGoal(exam.id)}
            className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"
          />
          <span
            className={`ml-3 block text-sm font-medium ${
              isFinalGoal ? "text-sky-800 font-bold" : "text-gray-700"
            }`}
          >
            Set as Final Goal for calculation
          </span>
        </label>
      </div>
    </div>
  );
}
