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
      onDragStart={() => onDragStart(course.id)}
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
      className={`flex items-end gap-2 p-3 border rounded-lg transition-all duration-150 cursor-grab ${
        isDragging
          ? "opacity-40 shadow-lg scale-105" // Style for the item being dragged
          : "opacity-100"
      } ${
        isDragOver
          ? "border-sky-500 border-2 border-dashed bg-sky-50" // Style for the drop target
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex-shrink-0 self-center text-gray-400">
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-grow">
        <label
          htmlFor={`courseName-${course.id}`}
          className="text-xs font-medium text-gray-500"
        >
          ชื่อคอร์ส
        </label>
        <input
          type="text"
          id={`courseName-${course.id}`}
          placeholder="เช่น ปรับพื้นฐาน"
          value={course.name}
          onChange={(e) => onUpdate(course.id, { name: e.target.value })}
          required
          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500 cursor-text"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag start from text input
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
          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-sky-500 focus:border-sky-500 cursor-text"
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag start from number input
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(course.id)}
        className="p-2 h-10 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors flex-shrink-0 cursor-pointer"
        onMouseDown={(e) => e.stopPropagation()} // Prevent drag start from button
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
