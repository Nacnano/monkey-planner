export interface Course {
  id: string;
  name: string;
  sheetCount: number;
  examName?: string;
  examDate?: string;
}

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
}

export interface CourseBreakdown {
  courseName: string;
  daysToFinish: number;
}

export interface DeadlineSuccessStatus {
  deadlineId: string;
  isSuccess: boolean;
}

export interface TimelineAnalysis {
  slotsPerWeek: number;
  weeksToFinish: number;
  daysToFinish: number;
  monthsToFinish: number;
  isSuccess: boolean;
  monthlyFee: number;
  courseBreakdown: CourseBreakdown[];
  deadlineSuccess: DeadlineSuccessStatus[];
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
  finalGoalCourseId: string | null;
}
