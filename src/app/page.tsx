"use client";

import React, { useState, useMemo, use } from "react";
import { BookOpen, Target, Calendar, HelpCircle } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import type { FormData, CalculationResults } from "@/types";
import { calculatePlan } from "@/services/calculationService";

function App() {
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = (data: FormData) => {
    const calculationResults = calculatePlan(data);
    setResults(calculationResults);
  };

  const assumptions = [
    "ชีท 1 ชุด = 1 slot = 2 ชั่วโมง",
    "นักเรียนเรียนใน slot เท่านั้น",
    "นักเรียนทำเสร็จแค่ 1 ชีท/slot",
    "นักเรียนไม่ลา ไม่ขาดเรียน",
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3">
            <BookOpen className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Course & Budget Planner
            </h1>
          </div>
          <p className="mt-2 text-lg text-slate-600">
            วางแผนการเรียนและประเมินค่าใช้จ่ายสู่เป้าหมายของนักเรียน
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InputForm onCalculate={handleCalculate} />
            <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-slate-200">
              <h3 className="flex items-center text-lg font-semibold text-slate-700 mb-4">
                <HelpCircle className="h-5 w-5 mr-2 text-amber-500" />
                ข้อสมมติฐาน (Assumptions)
              </h3>
              <ul className="space-y-2 text-slate-600">
                {assumptions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 font-bold mr-2">
                      {index + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            {results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <div className="text-center">
                  <Target className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-semibold text-slate-700">
                    Your Plan Awaits
                  </h2>
                  <p className="mt-2 text-slate-500">
                    กรอกข้อมูลด้านซ้ายเพื่อเริ่มการคำนวณและวางแผนการเรียน
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Course Planner. Built for clarity
            and confidence.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
