import React from "react";
import type { Exam } from "../../types";
import { CalendarCheck } from "lucide-react";
import { ExamInput } from "../ExamInput";

interface ExamListProps {
  exams: Exam[];
  finalGoalExamId: string | null;
  onAddExam: () => void;
  onRemoveExam: (id: string) => void;
  onUpdateExam: (id: string, data: Partial<Exam>) => void;
  onSetFinalGoal: (id: string) => void;
}

export function ExamList({
  exams,
  finalGoalExamId,
  onAddExam,
  onRemoveExam,
  onUpdateExam,
  onSetFinalGoal,
}: ExamListProps) {
  return (
    <div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-800">
          Exams & Deadlines (วันสอบ)
        </h2>
        <p className="text-sm text-gray-500">
          กำหนดวันสอบและเลือกเป้าหมายหลักในการคำนวณ
        </p>
      </div>
      <div className="space-y-3 mt-4">
        {exams.map((exam) => (
          <ExamInput
            key={exam.id}
            exam={exam}
            onUpdate={onUpdateExam}
            onRemove={onRemoveExam}
            isFinalGoal={exam.id === finalGoalExamId}
            onSetFinalGoal={onSetFinalGoal}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onAddExam}
        className="w-full flex items-center justify-center p-2 mt-4 text-sm text-amber-700 font-semibold bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        <CalendarCheck className="h-5 w-5 mr-2" />
        Add Exam
      </button>
    </div>
  );
}
