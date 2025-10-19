import React, { useState } from "react";
import type { Course, Exam, FormData } from "../types";
import {
  PlusCircle,
  BarChart,
  DollarSign,
  Send,
  CalendarCheck,
} from "lucide-react";
import { CourseInput } from "./CourseInput";
import { ExamInput } from "./ExamInput";

interface InputFormProps {
  onCalculate: (data: FormData) => void;
}

const createDueDate = (monthsToAdd: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsToAdd);
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
  const [preferredSlots, setPreferredSlots] = useState(2);
  const [pricePerSlot, setPricePerSlot] = useState(500);

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [finalGoalExamId, setFinalGoalExamId] = useState<string | null>(
    initialExams.length > 0 ? initialExams[initialExams.length - 1].id : null
  );

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
    const newExam = { id: crypto.randomUUID(), name: "", date: "" };
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      pricePerSlot > 0 &&
      courses.every((c) => c.sheetCount > 0) &&
      exams.every((ex) => ex.date) &&
      finalGoalExamId
    ) {
      onCalculate({
        preferredSlots,
        courses,
        exams,
        pricePerSlot,
        finalGoalExamId,
      });
    } else {
      alert(
        "Please fill in all required fields: Price, Sheet Counts, all Exam Dates, and select a Final Goal exam."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-xl shadow-md border border-slate-200 space-y-6"
    >
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3">
        Plan & Pricing
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="slots"
            className="flex items-center text-sm font-medium text-slate-700 mb-1"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Slots/Week (ครั้ง/สัปดาห์)*
          </label>
          <input
            type="number"
            id="slots"
            value={preferredSlots}
            onChange={(e) => setPreferredSlots(Number(e.target.value))}
            min="1"
            required
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="flex items-center text-sm font-medium text-slate-700 mb-1"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Price/Slot (ราคา/ครั้ง)*
          </label>
          <input
            type="number"
            id="price"
            value={pricePerSlot}
            onChange={(e) => setPricePerSlot(Number(e.target.value))}
            min="0"
            required
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 pt-4">
        Courses (คอร์สเรียน)
      </h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseInput
            key={course.id}
            course={course}
            onUpdate={updateCourse}
            onRemove={removeCourse}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addCourse}
        className="w-full flex items-center justify-center p-2 text-sm text-blue-600 font-semibold bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Course
      </button>

      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 pt-4">
        Exams & Deadlines (วันสอบ)
      </h2>
      <div className="space-y-4">
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
        className="w-full flex items-center justify-center p-2 text-sm text-amber-600 font-semibold bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
      >
        <CalendarCheck className="h-5 w-5 mr-2" />
        Add Exam
      </button>

      <button
        type="submit"
        className="w-full flex items-center justify-center p-3 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-transform transform hover:scale-105 mt-6"
      >
        <Send className="h-5 w-5 mr-2" />
        Calculate Plan
      </button>
    </form>
  );
}
