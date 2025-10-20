import React, { useState, useEffect, useCallback } from "react";
import type { Course, Exam, FormData } from "../types";
import {
  PlusCircle,
  DollarSign,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { CourseInput } from "./CourseInput";
import { ExamInput } from "./ExamInput";

interface InputFormProps {
  onCalculate: (data: FormData | null) => void;
}

const createDueDate = (monthsToAdd: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsToAdd);
  // Adjust for end of month issues
  if (date.getDate() < new Date().getDate()) {
    date.setDate(0);
  }
  return date.toISOString().split("T")[0];
};

const initialExams: Exam[] = [
  { id: crypto.randomUUID(), name: "Midterm Exam", date: createDueDate(5) },
  { id: crypto.randomUUID(), name: "Final Exam", date: createDueDate(9) },
  {
    id: crypto.randomUUID(),
    name: "University Entrance Exam",
    date: createDueDate(12),
  },
];

const initialCourses: Course[] = [
  { id: crypto.randomUUID(), name: "ปรับพื้นฐาน ม.ปลาย", sheetCount: 20 },
  { id: crypto.randomUUID(), name: "เนื้อหาฟิสิกส์ ม.5", sheetCount: 45 },
  { id: crypto.randomUUID(), name: "ตะลุยโจทย์ PAT3", sheetCount: 60 },
];

export function InputForm({ onCalculate }: InputFormProps) {
  const [pricePerSlot, setPricePerSlot] = useState(500);

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [finalGoalExamId, setFinalGoalExamId] = useState<string | null>(
    initialExams.length > 0 ? initialExams[initialExams.length - 1].id : null
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [draggedCourseId, setDraggedCourseId] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOnCalculate = useCallback(onCalculate, []);

  useEffect(() => {
    const validationErrors: string[] = [];
    if (!pricePerSlot || pricePerSlot <= 0)
      validationErrors.push("Price/Slot must be greater than 0.");
    courses.forEach((c, i) => {
      if (!c.name.trim())
        validationErrors.push(`Course #${i + 1} needs a name.`);
      if (!c.sheetCount || c.sheetCount <= 0)
        validationErrors.push(
          `Course "${
            c.name || `#${i + 1}`
          }" needs a sheet count greater than 0.`
        );
    });
    exams.forEach((ex, i) => {
      if (!ex.name.trim())
        validationErrors.push(`Exam #${i + 1} needs a name.`);
      if (!ex.date)
        validationErrors.push(`Exam "${ex.name || `#${i + 1}`}" needs a date.`);
    });
    if (exams.length > 0 && !finalGoalExamId)
      validationErrors.push("A Final Goal exam must be selected.");

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      stableOnCalculate({
        courses,
        exams,
        pricePerSlot,
        finalGoalExamId,
      });
    }
    // If there are errors, we NO LONGER call onCalculate(null).
    // This keeps the last valid result visible for a better UX.
  }, [pricePerSlot, courses, exams, finalGoalExamId, stableOnCalculate]);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: crypto.randomUUID(), name: "", sheetCount: 10 },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, ...updatedCourse } : course
      )
    );
  };

  const addExam = () => {
    const newExam = {
      id: crypto.randomUUID(),
      name: "",
      date: createDueDate(1),
    };
    setExams([...exams, newExam]);
    if (exams.length === 0) {
      setFinalGoalExamId(newExam.id);
    }
  };

  const removeExam = (id: string) => {
    setExams((prevExams) => {
      const newExams = prevExams.filter((exam) => exam.id !== id);
      if (id === finalGoalExamId) {
        setFinalGoalExamId(newExams[newExams.length - 1]?.id || null);
      }
      return newExams;
    });
  };

  const updateExam = (id: string, updatedExam: Partial<Exam>) => {
    setExams(
      exams.map((exam) => (exam.id === id ? { ...exam, ...updatedExam } : exam))
    );
  };

  const handleDragStart = (id: string) => {
    setDraggedCourseId(id);
  };

  const handleDragEnd = () => {
    setDraggedCourseId(null);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedCourseId || draggedCourseId === targetId) {
      setDraggedCourseId(null);
      return;
    }

    const draggedIndex = courses.findIndex((c) => c.id === draggedCourseId);
    const targetIndex = courses.findIndex((c) => c.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedCourseId(null);
      return;
    }

    const newCourses = [...courses];
    const [draggedItem] = newCourses.splice(draggedIndex, 1);
    newCourses.splice(targetIndex, 0, draggedItem);

    setCourses(newCourses);
    setDraggedCourseId(null);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Plan & Pricing</h2>
        <p className="text-sm text-gray-500">
          กำหนดค่าใช้จ่ายและจำนวนครั้งที่เรียนต่อสัปดาห์
        </p>
      </div>

      <div>
        <label
          htmlFor="price"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
          Price/Slot*
        </label>
        <input
          type="number"
          id="price"
          value={pricePerSlot}
          onChange={(e) => setPricePerSlot(Number(e.target.value))}
          min="0"
          required
          className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      <div className="border-t border-gray-200 !mt-8"></div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-800">
          Courses (คอร์สเรียน)
        </h2>
        <p className="text-sm text-gray-500">
          ระบุคอร์สและจำนวนชีททั้งหมดที่ต้องเรียน
        </p>
      </div>
      <div className="space-y-3">
        {courses.map((course) => (
          <CourseInput
            key={course.id}
            course={course}
            onUpdate={updateCourse}
            onRemove={removeCourse}
            isDragging={draggedCourseId === course.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addCourse}
        className="w-full flex items-center justify-center p-2 text-sm text-sky-700 font-semibold bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Course
      </button>

      <div className="border-t border-gray-200 !mt-8"></div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-800">
          Exams & Deadlines (วันสอบ)
        </h2>
        <p className="text-sm text-gray-500">
          กำหนดวันสอบและเลือกเป้าหมายหลักในการคำนวณ
        </p>
      </div>
      <div className="space-y-3">
        {exams.map((exam) => (
          <ExamInput
            key={exam.id}
            exam={exam}
            onUpdate={updateExam}
            onRemove={removeExam}
            isFinalGoal={exam.id === finalGoalExamId}
            onSetFinalGoal={setFinalGoalExamId}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addExam}
        className="w-full flex items-center justify-center p-2 text-sm text-amber-700 font-semibold bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        <CalendarCheck className="h-5 w-5 mr-2" />
        Add Exam
      </button>

      {errors.length > 0 && (
        <div className="!mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following issues:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul role="list" className="list-disc pl-5 space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
