"use client";

import React, { useState, useCallback } from "react";
import { BookOpen, Target } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import type { FormData, CalculationResults } from "@/types";
import { calculatePlan } from "@/services/calculationService";

function App() {
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = useCallback((data: FormData | null) => {
    if (data) {
      const calculationResults = calculatePlan(data);
      setResults(calculationResults);
    } else {
      setResults(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
      <main className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-3">
            <BookOpen className="h-10 w-10 text-sky-600" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              เครื่องมือคำนวณจำนวน Slot และค่าเรียน
            </h1>
          </div>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            เพื่อให้แน่ใจว่า นักเรียนจะบรรลุเป้าหมายได้ทันในงบที่จำกัด
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* --- Input Section --- */}
          <div id="input-section">
            <InputForm onCalculate={handleCalculate} />
          </div>

          {/* --- Divider --- */}
          <div className="relative no-print">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300 border-dashed" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-3 text-gray-500">
                <Target className="h-6 w-6" />
              </span>
            </div>
          </div>

          {/* --- Results Section --- */}
          <div id="results-section">
            {results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="no-print flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="text-center">
                  <Target className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    ผลลัพธ์การคำนวณของคุณ
                  </h2>
                  <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                    กรอกข้อมูลคอร์สเรียนและกำหนดเวลาด้านบนเพื่อคำนวณเวลาและค่าเรียนของคุณ
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-16 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Course Planner.
            สร้างขึ้นเพื่อความชัดเจนและความมั่นใจ
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
