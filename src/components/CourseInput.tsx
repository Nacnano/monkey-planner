import React from "react";
import type { Course } from "../types";
import { Trash2, GripVertical } from "lucide-react";

interface CourseInputProps {
  course: Course;
  onUpdate: (id: string, updatedCourse: Partial<Course>) => void;
  onRemove: (id: string) => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
}

export function CourseInput({
  course,
  onUpdate,
  onRemove,
  isDragging,
  onDragStart,
  onDragEnd,
  onDrop,
}: CourseInputProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
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
      className={`p-4 border rounded-lg transition-all duration-150 ${
        isDragging ? "opacity-40 shadow-lg scale-105" : "opacity-100"
      } ${
        isDragOver
          ? "border-sky-500 border-2 border-dashed bg-sky-50"
          : "bg-white border-gray-200"
      }`}
    >
      {/* --- Unified Input Row --- */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <div className="flex-shrink-0 self-center text-gray-400 cursor-grab drag-handle">
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-grow min-w-[160px]">
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

        {/* --- Optional Deadline Info --- */}
        <div className="hidden lg:flex self-stretch items-center">
          <div className="h-10 border-l border-gray-200"></div>
        </div>

        <div className="flex-grow min-w-[160px]">
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
            onChange={(e) => onUpdate(course.id, { examName: e.target.value })}
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
            onChange={(e) => onUpdate(course.id, { examDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        {/* Trash Button */}
        <button
          type="button"
          onClick={() => onRemove(course.id)}
          className="p-2 h-10 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors flex-shrink-0"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
