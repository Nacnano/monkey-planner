import React from "react";
import { HelpCircle } from "lucide-react";

const ASSUMPTIONS = [
  "ชีท 1 ชุด = 1 slot = 2 ชั่วโมง",
  "นักเรียนเรียนใน slot เท่านั้น",
  "นักเรียนทำเสร็จแค่ 1 ชีท/slot",
  "นักเรียนไม่ลา ไม่ขาดเรียน",
];

interface AssumptionsCardProps {
  isModal?: boolean;
}

export function AssumptionsCard({ isModal = false }: AssumptionsCardProps) {
  const content = (
    <>
      {!isModal && (
        <h3 className="flex items-center text-lg font-bold text-gray-800 mb-4">
          <HelpCircle className="h-6 w-6 mr-3 text-amber-500" />
          ข้อสมมติฐาน (Assumptions)
        </h3>
      )}
      <ul className="space-y-3 text-gray-600">
        {ASSUMPTIONS.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 font-bold text-sm mr-3 flex-shrink-0">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      {content}
    </div>
  );
}
