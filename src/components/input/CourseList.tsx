import React from "react";
import type { Course } from "../../types";
import { PlusCircle } from "lucide-react";
import { CourseInput } from "../CourseInput";

interface CourseListProps {
  courses: Course[];
  draggedCourseId: string | null;
  onAddCourse: () => void;
  onRemoveCourse: (id: string) => void;
  onUpdateCourse: (id: string, data: Partial<Course>) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
}

export function CourseList({
  courses,
  draggedCourseId,
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
  onDragStart,
  onDragEnd,
  onDrop,
}: CourseListProps) {
  return (
    <div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-800">
          คอร์สเรียนและกำหนดเวลา (Courses & Deadlines)
        </h2>
      </div>
      <div className="space-y-3 mt-4">
        {courses.map((course) => (
          <CourseInput
            key={course.id}
            course={course}
            onUpdate={onUpdateCourse}
            onRemove={onRemoveCourse}
            isDragging={draggedCourseId === course.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onAddCourse}
        className="w-full flex items-center justify-center p-2 mt-4 text-sm text-sky-700 font-semibold bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        เพิ่มคอร์สเรียน
      </button>
    </div>
  );
}
