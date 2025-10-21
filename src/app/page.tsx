"use client";

import React, { useState, useCallback } from "react";
import { BookOpen, Target } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import type { FormData, CalculationResults } from "@/types";
import { calculatePlan } from "@/services/calculationService";
import { AssumptionsCard } from "@/components/AssumptionsCard";

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
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex justify-center items-center gap-3">
            <BookOpen className="h-10 w-10 text-sky-600" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Course & Budget Planner
            </h1>
          </div>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Instantly calculate your study plan to ensure you reach your goals
            on time and on budget.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <InputForm onCalculate={handleCalculate} />
              <AssumptionsCard />
            </div>
          </div>

          <div className="lg:col-span-3">
            {results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="text-center">
                  <Target className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Your Plan Awaits
                  </h2>
                  <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                    Fill in your courses and deadlines on the left to see your
                    personalized study plan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-16 text-sm text-gray-500">
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
