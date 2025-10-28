import type { Course, Exam } from "../types";

// Official dates for the TCAS69 examination cycle (for university admission in 2026).

export const initialExams: Exam[] = [
  // TGAT/TPAT2-5 exams are in mid-December 2025
  { id: crypto.randomUUID(), name: "TGAT / TPAT2-5", date: "2025-12-13" },
  // TPAT1 (GATPAT for medicine) exam is in mid-February 2026
  { id: crypto.randomUUID(), name: "TPAT1 (กสพท)", date: "2026-02-14" },
  // A-Level exams are in mid-March 2026
  {
    id: crypto.randomUUID(),
    name: "สอบ A-Level",
    date: "2026-03-14",
  },
];

export const initialCourses: Course[] = [
  { id: crypto.randomUUID(), name: "ปรับพื้นฐาน", sheetCount: 30 },
  { id: crypto.randomUUID(), name: "เก่งที่โรงเรียน", sheetCount: 40 },
  { id: crypto.randomUUID(), name: "สอบเข้า", sheetCount: 50 },
];
