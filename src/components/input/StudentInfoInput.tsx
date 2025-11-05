import React from "react";
import { User, Star } from "lucide-react";

interface StudentInfoInputProps {
  studentName: string;
  setStudentName: (value: string) => void;
  studentNickname: string;
  setStudentNickname: (value: string) => void;
  studentGoal: string;
  setStudentGoal: (value: string) => void;
}

export function StudentInfoInput({
  studentName,
  setStudentName,
  studentNickname,
  setStudentNickname,
  studentGoal,
  setStudentGoal,
}: StudentInfoInputProps) {
  return (
    <div>
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-bold text-gray-800">ข้อมูลนักเรียน</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="studentNickname"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <User className="h-4 w-4 mr-2 text-gray-400" />
            ชื่อเล่นนักเรียน*
          </label>
          <input
            type="text"
            id="studentNickname"
            value={studentNickname}
            onChange={(e) => setStudentNickname(e.target.value)}
            placeholder="แน็ค"
            required
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="studentName"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <User className="h-4 w-4 mr-2 text-gray-400" />
            ชื่อ-นามสกุล (ถ้ามี)
          </label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="โชติพิสิฐ"
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="studentGoal"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Star className="h-4 w-4 mr-2 text-gray-400" />
            เป้าหมาย (ถ้ามี)
          </label>
          <input
            type="text"
            id="studentGoal"
            value={studentGoal}
            onChange={(e) => setStudentGoal(e.target.value)}
            placeholder="สอบติดมหาลัย"
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>
    </div>
  );
}
