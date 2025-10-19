import React, { useState } from "react";
import type { Course, FormData } from "../types";
import {
  PlusCircle,
  User,
  Target,
  Calendar,
  BarChart,
  DollarSign,
  Send,
} from "lucide-react";
import { CourseInput } from "./CourseInput";

interface InputFormProps {
  onCalculate: (data: FormData) => void;
}

export function InputForm({ onCalculate }: InputFormProps) {
  const [studentNickname, setStudentNickname] = useState("Fah");
  const [goal, setGoal] = useState("สอบติดม.บูรพา");

  const today = new Date();
  today.setMonth(today.getMonth() + 12); // Default to 1 year from now
  const [dueDate, setDueDate] = useState(today.toISOString().split("T")[0]);

  const [preferredSlots, setPreferredSlots] = useState(2);
  const [pricePerSlot, setPricePerSlot] = useState(500);
  const [courses, setCourses] = useState<Course[]>([
    { id: crypto.randomUUID(), name: "ปรับพื้นฐาน", sheetCount: 20 },
    { id: crypto.randomUUID(), name: "เนื้อหาสอบเข้า", sheetCount: 60 },
  ]);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: crypto.randomUUID(), name: "", sheetCount: 0 },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      studentNickname &&
      dueDate &&
      pricePerSlot > 0 &&
      courses.every((c) => c.sheetCount > 0)
    ) {
      onCalculate({
        studentNickname,
        goal,
        dueDate,
        preferredSlots,
        courses,
        pricePerSlot,
      });
    } else {
      alert(
        "Please fill in all required fields: Nickname, Due Date, Price, and Sheet Counts for all courses."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-xl shadow-md border border-slate-200 space-y-6"
    >
      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3">
        Student Information
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="nickname"
            className="flex items-center text-sm font-medium text-slate-700 mb-1"
          >
            <User className="h-4 w-4 mr-2" />
            Student Nickname (ชื่อเล่น)*
          </label>
          <input
            type="text"
            id="nickname"
            value={studentNickname}
            onChange={(e) => setStudentNickname(e.target.value)}
            required
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="goal"
            className="flex items-center text-sm font-medium text-slate-700 mb-1"
          >
            <Target className="h-4 w-4 mr-2" />
            Goal (เป้าหมาย)
          </label>
          <input
            type="text"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="flex items-center text-sm font-medium text-slate-700 mb-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Due Date (วันสอบ/วันสิ้นสุด)*
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-800 border-b pb-3 pt-4">
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

      <button
        type="submit"
        className="w-full flex items-center justify-center p-3 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        <Send className="h-5 w-5 mr-2" />
        Calculate Plan
      </button>
    </form>
  );
}
