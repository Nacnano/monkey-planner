import React from "react";
import type { Course } from "../types";
import { Trash2 } from "lucide-react";

interface CourseInputProps {
  course: Course;
  onUpdate: (id: string, updatedCourse: Partial<Course>) => void;
  onRemove: (id: string) => void;
}

export function CourseInput({ course, onUpdate, onRemove }: CourseInputProps) {
  return (
    <div className="flex items-end gap-2 p-3 border border-gray-200 rounded-lg">
      <div className="flex-grow">
        <label
          htmlFor={`courseName-${course.id}`}
          className="text-xs font-medium text-gray-500"
        >
          Course Name
        </label>
        <input
          type="text"
          id={`courseName-${course.id}`}
          placeholder="e.g. ปรับพื้นฐาน"
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
          Sheets*
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
  );
}
