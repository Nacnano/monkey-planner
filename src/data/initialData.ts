import type { Course } from "../types";

export const initialCourses: Course[] = [
  {
    id: crypto.randomUUID(),
    name: "ปรับพื้นฐาน TGAT",
    sheetCount: 30,
    examName: "TGAT / TPAT2-5",
    examDate: "2025-12-13",
  },
  {
    id: crypto.randomUUID(),
    name: "ตะลุยโจทย์ TPAT1",
    sheetCount: 40,
    examName: "TPAT1 (กสพท)",
    examDate: "2026-02-14",
  },
  {
    id: crypto.randomUUID(),
    name: "เก็บเนื้อหา A-Level",
    sheetCount: 50,
    examName: "สอบ A-Level",
    examDate: "2026-03-14",
  },
];
