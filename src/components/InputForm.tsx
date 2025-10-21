import React, { useState, useEffect, useCallback } from "react";
import type { Course, Exam, FormData } from "../types";
import { PricingInput } from "./input/PricingInput";
import { CourseList } from "./input/CourseList";
import { ExamList } from "./input/ExamList";
import { ValidationErrorDisplay } from "./input/ValidationErrorDisplay";
import { createDueDate } from "../utils/dateUtils";

interface InputFormProps {
  onCalculate: (data: FormData | null) => void;
}

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

  const stableOnCalculate = useCallback(onCalculate, [onCalculate]);

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
      stableOnCalculate({ courses, exams, pricePerSlot, finalGoalExamId });
    }
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

  const handleDrop = (targetId: string) => {
    if (!draggedCourseId || draggedCourseId === targetId) return;
    const draggedIndex = courses.findIndex((c) => c.id === draggedCourseId);
    const targetIndex = courses.findIndex((c) => c.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCourses = [...courses];
    const [draggedItem] = newCourses.splice(draggedIndex, 1);
    newCourses.splice(targetIndex, 0, draggedItem);
    setCourses(newCourses);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <PricingInput
        pricePerSlot={pricePerSlot}
        setPricePerSlot={setPricePerSlot}
      />

      <div className="border-t border-gray-200 !mt-8"></div>

      <CourseList
        courses={courses}
        draggedCourseId={draggedCourseId}
        onAddCourse={addCourse}
        onRemoveCourse={removeCourse}
        onUpdateCourse={updateCourse}
        onDragStart={handleDragStart}
        onDragEnd={() => setDraggedCourseId(null)}
        onDrop={handleDrop}
      />

      <div className="border-t border-gray-200 !mt-8"></div>

      <ExamList
        exams={exams}
        finalGoalExamId={finalGoalExamId}
        onAddExam={addExam}
        onRemoveExam={removeExam}
        onUpdateExam={updateExam}
        onSetFinalGoal={setFinalGoalExamId}
      />

      {errors.length > 0 && <ValidationErrorDisplay errors={errors} />}
    </div>
  );
}
