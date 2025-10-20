export interface Course {
  id: string;
  name: string;
  sheetCount: number;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
}

export interface FormData {
  courses: Course[];
  exams: Exam[];
  pricePerSlot: number;
  finalGoalExamId: string | null;
}

export interface CourseBreakdown {
  courseName: string;
  daysToFinish: number;
}

export interface TimelineAnalysis {
  slotsPerWeek: number;
  weeksToFinish: number;
  daysToFinish: number;
  isSuccess: boolean;
  monthlyFee: number;
  courseBreakdown: CourseBreakdown[];
}

export interface ExamDeadline {
  id: string;
  examName: string;
  date: string;
  daysRemaining: number;
}

export interface CalculationResults {
  inputs: FormData;
  totalSheets: number;
  examDeadlines: ExamDeadline[];
  requiredSlotsPerWeek: number;
  totalFee: number;
  recommendedPlan: TimelineAnalysis;
  timelineScenarios: TimelineAnalysis[];
}
