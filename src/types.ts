export interface Course {
  id: string;
  name: string;
  sheetCount: number;
  examName?: string;
  examDate?: string;
}

// FIX: Add missing Exam interface to resolve compilation errors.
export interface Exam {
  id: string;
  name: string;
  date: string;
}

export interface FormData {
  studentName?: string;
  studentNickname: string;
  studentGoal?: string;
  courses: Course[];
  pricePerSlot: number;
  finalGoalCourseId: string | null;
}

export interface CourseBreakdown {
  courseName: string;
  daysToFinish: number;
}

export interface TimelineAnalysis {
  slotsPerWeek: number;
  weeksToFinish: number;
  daysToFinish: number;
  monthsToFinish: number;
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
