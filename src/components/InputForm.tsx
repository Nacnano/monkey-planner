import React, { useState, useEffect, useCallback } from "react";
import type { Course, FormData } from "../types";
import { PricingInput } from "./input/PricingInput";
import { CourseList } from "./input/CourseList";
import { ValidationErrorDisplay } from "./input/ValidationErrorDisplay";
import { initialCourses } from "../data/initialData";
import { StudentInfoInput } from "./input/StudentInfoInput";
import { Modal } from "./Modal";
import { AssumptionsCard } from "./AssumptionsCard";
import { DollarSign, HelpCircle } from "lucide-react";

interface InputFormProps {
  onCalculate: (data: FormData | null) => void;
}

export function InputForm({ onCalculate }: InputFormProps) {
  const [studentName, setStudentName] = useState("");
  const [studentNickname, setStudentNickname] = useState("");
  const [studentGoal, setStudentGoal] = useState("");
  const [pricePerSlot, setPricePerSlot] = useState(500);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [finalGoalCourseId, setFinalGoalCourseId] = useState<string | null>(
    initialCourses.length > 0
      ? initialCourses[initialCourses.length - 1].id
      : null
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [draggedCourseId, setDraggedCourseId] = useState<string | null>(null);

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);

  const stableOnCalculate = useCallback(onCalculate, [onCalculate]);

  useEffect(() => {
    const validationErrors: string[] = [];
    if (!studentNickname.trim())
      validationErrors.push("ต้องระบุชื่อเล่นของนักเรียน");
    if (!pricePerSlot || pricePerSlot <= 0)
      validationErrors.push("ราคาต่อคาบเรียนต้องมากกว่า 0");

    let hasAtLeastOneDeadline = false;
    courses.forEach((c, i) => {
      if (!c.name.trim())
        validationErrors.push(`คอร์สเรียน #${i + 1} ต้องมีชื่อ`);
      if (!c.sheetCount || c.sheetCount <= 0)
        validationErrors.push(
          `คอร์ส "${c.name || `#${i + 1}`}" ต้องมีจำนวนชีทมากกว่า 0`
        );
      if (c.examName || c.examDate) {
        hasAtLeastOneDeadline = true;
        if (!c.examName)
          validationErrors.push(`คอร์ส "${c.name}" ต้องมีชื่อการสอบ`);
        if (!c.examDate)
          validationErrors.push(`คอร์ส "${c.name}" ต้องมีวันสอบ`);
      }
    });

    if (!finalGoalCourseId && hasAtLeastOneDeadline)
      validationErrors.push(
        "ต้องเลือกกำหนดเวลาที่เป็นเป้าหมายสุดท้าย (ค่าเริ่มต้น)"
      );

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      stableOnCalculate({
        studentName,
        studentNickname,
        studentGoal,
        courses,
        pricePerSlot,
        finalGoalCourseId,
      });
    } else {
      stableOnCalculate(null);
    }
  }, [
    studentName,
    studentNickname,
    studentGoal,
    pricePerSlot,
    courses,
    finalGoalCourseId,
    stableOnCalculate,
  ]);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: crypto.randomUUID(), name: "", sheetCount: 10 },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses((prevCourses) => {
      const newCourses = prevCourses.filter((course) => course.id !== id);
      if (id === finalGoalCourseId) {
        const lastCourseWithDeadline = [...newCourses]
          .reverse()
          .find((c) => c.examDate && c.examName);
        setFinalGoalCourseId(lastCourseWithDeadline?.id || null);
      }
      return newCourses;
    });
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, ...updatedCourse } : course
      )
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
      <StudentInfoInput
        studentName={studentName}
        setStudentName={setStudentName}
        studentNickname={studentNickname}
        setStudentNickname={setStudentNickname}
        studentGoal={studentGoal}
        setStudentGoal={setStudentGoal}
      />

      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => setIsPriceModalOpen(true)}
          className="flex-1 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center justify-center p-2"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          ตั้งค่าราคา
        </button>
        <button
          type="button"
          onClick={() => setIsAssumptionsModalOpen(true)}
          className="flex-1 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center justify-center p-2"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          ดูข้อสมมติฐาน
        </button>
      </div>

      <Modal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="ตั้งค่าราคาต่อคาบเรียน"
      >
        <PricingInput
          pricePerSlot={pricePerSlot}
          setPricePerSlot={setPricePerSlot}
          isModal={true}
        />
      </Modal>

      <Modal
        isOpen={isAssumptionsModalOpen}
        onClose={() => setIsAssumptionsModalOpen(false)}
        title="ข้อสมมติฐาน (Assumptions)"
      >
        <AssumptionsCard isModal={true} />
      </Modal>

      <div className="border-t border-gray-200 !mt-6"></div>

      <CourseList
        courses={courses}
        draggedCourseId={draggedCourseId}
        finalGoalCourseId={finalGoalCourseId}
        onAddCourse={addCourse}
        onRemoveCourse={removeCourse}
        onUpdateCourse={updateCourse}
        onSetFinalGoal={setFinalGoalCourseId}
        onDragStart={handleDragStart}
        onDragEnd={() => setDraggedCourseId(null)}
        onDrop={handleDrop}
      />

      {errors.length > 0 && <ValidationErrorDisplay errors={errors} />}
    </div>
  );
}
