import type { Course, Exam } from "../types";

export const initialExams: Exam[] = [
  { id: crypto.randomUUID(), name: "TGAT / TPAT2-5", date: "2025-12-13" },
  { id: crypto.randomUUID(), name: "TPAT1 (กสพท)", date: "2026-02-14" },
  {
    id: crypto.randomUUID(),
    name: "A-Level Exams",
    date: "2026-03-14",
  },
];

export const initialCourses: Course[] = [
  { id: crypto.randomUUID(), name: "ปรับพื้นฐาน", sheetCount: 10 },
  { id: crypto.randomUUID(), name: "เก่งที่โรงเรียน", sheetCount: 20 },
  { id: crypto.randomUUID(), name: "สอบเข้า", sheetCount: 30 },
];
