"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  DollarSign,
  Clock,
  BookOpen,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function CourseCalculator() {
  const [studentName, setStudentName] = useState("");
  const [studentNickname, setStudentNickname] = useState("");
  const [studentGoal, setStudentGoal] = useState("");
  const [slotsPerWeek, setSlotsPerWeek] = useState("");
  const [pricePerSlot, setPricePerSlot] = useState("");

  const [courses, setCourses] = useState([
    { name: "", sheetCount: "", dueDate: "" },
  ]);

  const addCourse = () => {
    setCourses([...courses, { name: "", sheetCount: "", dueDate: "" }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const calculations = useMemo(() => {
    const results = courses
      .map((course) => {
        const sheets = parseFloat(course.sheetCount) || 0;
        const slots = parseFloat(slotsPerWeek) || 0;
        const price = parseFloat(pricePerSlot) || 0;

        if (!course.dueDate || sheets === 0 || slots === 0) {
          return null;
        }

        const dueDate = new Date(course.dueDate);
        const today = new Date();
        const daysTillExam = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysTillExam <= 0) return null;

        const weeksToFinish = sheets / slots;
        const daysToFinish = weeksToFinish * 7;
        const ratio = daysToFinish / daysTillExam;
        const willFinishOnTime = ratio <= 1;

        const requiredSlotsPerWeek = (7 * sheets) / daysTillExam;

        const totalFee = price * sheets;
        const monthsToLearn = (7 / 30) * weeksToFinish;
        const feePerMonth = (30 * price * slots) / 7;
        const sufficientSlotFeePerMonth = (30 * price * sheets) / daysTillExam;

        return {
          courseName: course.name,
          sheets,
          daysTillExam,
          daysToFinish: Math.ceil(daysToFinish),
          ratio,
          willFinishOnTime,
          requiredSlotsPerWeek: Math.ceil(requiredSlotsPerWeek * 10) / 10,
          totalFee,
          monthsToLearn,
          feePerMonth,
          sufficientSlotFeePerMonth,
        };
      })
      .filter(Boolean);

    const totalSheets = courses.reduce(
      (sum, c) => sum + (parseFloat(c.sheetCount) || 0),
      0
    );
    const price = parseFloat(pricePerSlot) || 0;
    const slots = parseFloat(slotsPerWeek) || 0;
    const grandTotal = price * totalSheets;

    return { courseResults: results, totalSheets, grandTotal };
  }, [courses, slotsPerWeek, pricePerSlot]);

  const isFormValid =
    studentNickname && pricePerSlot && courses.some((c) => c.sheetCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              คำนวณระยะเวลาและงบประมาณคอร์สเรียน
            </h1>
          </div>
          <p className="text-gray-600 ml-15">
            ช่วยผู้ปกครองและครูวางแผนการเรียนอย่างมีประสิทธิภาพ
          </p>
        </div>

        {/* Assumptions Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            สมมติฐานการคำนวณ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div>1. ชีท 1 ชุด = 1 slot = 2 ชั่วโมง</div>
            <div>2. นักเรียนเรียนใน slot เท่านั้น</div>
            <div>3. นักเรียนทำเสร็จแค่ 1 ชีท/slot</div>
            <div>4. นักเรียนไม่ลา ไม่ขาดเรียน</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ข้อมูลนักเรียน
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อนักเรียน
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ชื่อเต็ม"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อเล่น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentNickname}
                    onChange={(e) => setStudentNickname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ชื่อเล่น"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เป้าหมาย
                  </label>
                  <input
                    type="text"
                    value={studentGoal}
                    onChange={(e) => setStudentGoal(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="เช่น สอบติด MWITS"
                  />
                </div>
              </div>
            </div>

            {/* Course Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                การตั้งค่าคอร์ส
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    จำนวน slot ต่อสัปดาห์
                  </label>
                  <input
                    type="number"
                    value={slotsPerWeek}
                    onChange={(e) => setSlotsPerWeek(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="เช่น 2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ราคาต่อ slot (บาท) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={pricePerSlot}
                    onChange={(e) => setPricePerSlot(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="เช่น 800"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  รายละเอียดคอร์ส
                </h2>
                <button
                  onClick={addCourse}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  + เพิ่มคอร์ส
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-4 relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">
                        คอร์สที่ {index + 1}
                      </h3>
                      {courses.length > 1 && (
                        <button
                          onClick={() => removeCourse(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          ลบ
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ชื่อคอร์ส
                        </label>
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) =>
                            updateCourse(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="เช่น ปรับพื้นฐาน"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          จำนวนชีท <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={course.sheetCount}
                          onChange={(e) =>
                            updateCourse(index, "sheetCount", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="เช่น 20"
                          min="1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          วันครบกำหนด
                        </label>
                        <input
                          type="date"
                          value={course.dueDate}
                          onChange={(e) =>
                            updateCourse(index, "dueDate", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white sticky top-6">
              <h2 className="text-xl font-bold mb-4">สรุปภาพรวม</h2>

              {!isFormValid ? (
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-sm">
                    กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-sm opacity-90 mb-1">นักเรียน</div>
                    <div className="text-2xl font-bold">{studentNickname}</div>
                    {studentGoal && (
                      <div className="text-sm mt-1 opacity-90">
                        เป้าหมาย: {studentGoal}
                      </div>
                    )}
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                      <BookOpen className="w-4 h-4" />
                      จำนวนชีททั้งหมด
                    </div>
                    <div className="text-3xl font-bold">
                      {calculations.totalSheets}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                      <DollarSign className="w-4 h-4" />
                      ค่าเรียนทั้งหมด
                    </div>
                    <div className="text-3xl font-bold">
                      {calculations.grandTotal.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-90">บาท</div>
                  </div>

                  {slotsPerWeek && (
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        Slot ต่อสัปดาห์
                      </div>
                      <div className="text-3xl font-bold">{slotsPerWeek}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {isFormValid && calculations.courseResults.length > 0 && (
          <div className="mt-6 space-y-6">
            {calculations.courseResults.map((result, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {result.courseName || `คอร์สที่ ${index + 1}`}
                </h3>

                {/* Timeline Status */}
                <div
                  className={`${
                    result.willFinishOnTime
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  } border-2 rounded-lg p-4 mb-6`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        สถานะการเรียน
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          result.willFinishOnTime
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.willFinishOnTime
                          ? "✓ เรียนทันสอบ"
                          : "✗ ไม่ทันสอบ"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Ratio</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {result.ratio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                      <Clock className="w-4 h-4" />
                      วันที่เหลือ
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {result.daysTillExam}
                    </div>
                    <div className="text-xs text-blue-600">วัน</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-purple-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      ใช้เวลาเรียน
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {result.daysToFinish}
                    </div>
                    <div className="text-xs text-purple-600">วัน</div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-sm text-orange-600 mb-1">จำนวนชีท</div>
                    <div className="text-2xl font-bold text-orange-900">
                      {result.sheets}
                    </div>
                    <div className="text-xs text-orange-600">ชีท</div>
                  </div>

                  <div className="bg-teal-50 rounded-lg p-4">
                    <div className="text-sm text-teal-600 mb-1">
                      Slot ที่ต้องการ
                    </div>
                    <div className="text-2xl font-bold text-teal-900">
                      {result.requiredSlotsPerWeek}
                    </div>
                    <div className="text-xs text-teal-600">ต่อสัปดาห์</div>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <h4 className="font-bold text-gray-800 mb-3">
                    รายละเอียดงบประมาณ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        ค่าเรียนทั้งหมด
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {result.totalFee.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">บาท</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        ระยะเวลาเรียน
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {result.monthsToLearn.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">เดือน</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">
                        ค่าเรียนต่อเดือน
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {result.feePerMonth.toLocaleString("th-TH", {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className="text-xs text-gray-600">บาท/เดือน</div>
                    </div>
                  </div>

                  {!result.willFinishOnTime && (
                    <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                      <div className="font-semibold text-yellow-900 mb-2">
                        💡 คำแนะนำ
                      </div>
                      <div className="text-sm text-yellow-800">
                        เพื่อให้เรียนทันสอบ แนะนำให้เพิ่มจำนวน slot เป็น{" "}
                        <span className="font-bold">
                          {result.requiredSlotsPerWeek} slot/สัปดาห์
                        </span>
                        <div className="mt-2">
                          ค่าใช้จ่ายต่อเดือนจะเป็น{" "}
                          <span className="font-bold">
                            {result.sufficientSlotFeePerMonth.toLocaleString(
                              "th-TH",
                              { maximumFractionDigits: 0 }
                            )}{" "}
                            บาท
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
