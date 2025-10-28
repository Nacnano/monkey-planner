import React from "react";
import type { Course } from "../types";
import { Trash2, GripVertical, Calendar } from "lucide-react";

interface CourseInputProps {
  course: Course;
  onUpdate: (id: string, updatedCourse: Partial<Course>) => void;
  onRemove: (id: string) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
  isFinalGoal: boolean;
  onSetFinalGoal: (id: string) => void;
}

export function CourseInput({
  course,
  onUpdate,
  onRemove,
  isDragging,
  onDragStart,
  onDragEnd,
  onDrop,
  isFinalGoal,
  onSetFinalGoal,
}: CourseInputProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const hasDeadline = course.examName || course.examDate;

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Only allow dragging from the grip handle
        if ((e.target as HTMLElement).closest(".drag-handle")) {
          onDragStart(course.id);
        } else {
          e.preventDefault();
        }
      }}
      onDragEnd={() => {
        setIsDragOver(false);
        onDragEnd();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(course.id);
      }}
      className={`p-3 border rounded-lg transition-all duration-150 ${
        isDragging ? "opacity-40 shadow-lg scale-105" : "opacity-100"
      } ${
        isDragOver
          ? "border-sky-500 border-2 border-dashed bg-sky-50"
          : isFinalGoal
          ? "bg-sky-50 border-sky-300 shadow-md"
          : "bg-white border-gray-200"
      }`}
    >
      {/* --- Main Course Info --- */}
      <div className="flex items-end gap-2">
        <div className="flex-shrink-0 self-center text-gray-400 cursor-grab drag-handle">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-grow">
          <label
            htmlFor={`courseName-${course.id}`}
            className="text-xs font-medium text-gray-500"
          >
            ชื่อคอร์ส*
          </label>
          <input
            type="text"
            id={`courseName-${course.id}`}
            placeholder="เช่น ปรับพื้นฐาน"
            value={course.name}
            onChange={(e) => onUpdate(course.id, { name: e.target.value })}
            required
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div className="w-28 flex-shrink-0">
          <label
            htmlFor={`sheetCount-${course.id}`}
            className="text-xs font-medium text-gray-500"
          >
            จำนวนชีท*
          </label>
          <input
            type="number"
            id={`sheetCount-${course.id}`}
            min="1"
            value={course.sheetCount}
            onChange={(e) =>
              onUpdate(course.id, { sheetCount: Number(e.target.value) })
            }
            required
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(course.id)}
          className="p-2 h-10 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors flex-shrink-0"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* --- Optional Deadline Info --- */}
      <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <label
              htmlFor={`examName-${course.id}`}
              className="text-xs font-medium text-gray-500"
            >
              ชื่อการสอบ/กำหนดเวลา (ถ้ามี)
            </label>
            <input
              type="text"
              id={`examName-${course.id}`}
              placeholder="เช่น สอบกลางภาค"
              value={course.examName || ""}
              onChange={(e) =>
                onUpdate(course.id, { examName: e.target.value })
              }
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="flex-shrink-0">
            <label
              htmlFor={`examDate-${course.id}`}
              className="text-xs font-medium text-gray-500"
            >
              วันสอบ (ถ้ามี)
            </label>
            <input
              type="date"
              id={`examDate-${course.id}`}
              value={course.examDate || ""}
              onChange={(e) =>
                onUpdate(course.id, { examDate: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

        {hasDeadline && (
          <div className="mt-3">
            <label
              htmlFor={`finalGoal-${course.id}`}
              className="flex items-center w-full cursor-pointer p-2 rounded-lg hover:bg-sky-100 transition-colors"
            >
              <input
                type="radio"
                id={`finalGoal-${course.id}`}
                name="finalGoalCourse"
                checked={isFinalGoal}
                onChange={() => onSetFinalGoal(course.id)}
                className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"
              />
              <span
                className={`ml-3 block text-sm font-medium ${
                  isFinalGoal ? "text-sky-800 font-bold" : "text-gray-700"
                }`}
              >
                ตั้งเป็นเป้าหมายสุดท้าย (ค่าเริ่มต้น)
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
