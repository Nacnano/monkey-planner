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
    <div className="flex items-end gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex-grow">
        <label
          htmlFor={`courseName-${course.id}`}
          className="text-xs font-medium text-slate-600"
        >
          Course Name
        </label>
        <input
          type="text"
          id={`courseName-${course.id}`}
          placeholder="e.g. ปรับพื้นฐาน"
          value={course.name}
          onChange={(e) => onUpdate(course.id, { name: e.target.value })}
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="w-28">
        <label
          htmlFor={`sheetCount-${course.id}`}
          className="text-xs font-medium text-slate-600"
        >
          Sheets* (จำนวนชีท)
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
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(course.id)}
        className="p-2 h-10 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
