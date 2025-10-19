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
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-end gap-2">
        <div className="flex-grow">
          <label
            htmlFor={`examName-${exam.id}`}
            className="text-xs font-medium text-slate-600"
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
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor={`examDate-${exam.id}`}
            className="text-xs font-medium text-slate-600"
          >
            Exam Date*
          </label>
          <input
            type="date"
            id={`examDate-${exam.id}`}
            value={exam.date}
            onChange={(e) => onUpdate(exam.id, { date: e.target.value })}
            required
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(exam.id)}
          className="p-2 h-10 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id={`finalGoal-${exam.id}`}
          name="finalGoalExam"
          checked={isFinalGoal}
          onChange={() => onSetFinalGoal(exam.id)}
          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <label
          htmlFor={`finalGoal-${exam.id}`}
          className="ml-2 block text-sm font-medium text-slate-700 cursor-pointer"
        >
          Set as Final Goal for calculation
        </label>
      </div>
    </div>
  );
}
