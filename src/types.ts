export interface Course {
  id: string;
  name: string;
  sheetCount: number;
}

export interface FormData {
  studentNickname: string;
  goal: string;
  dueDate: string;
  preferredSlots: number;
  courses: Course[];
  pricePerSlot: number;
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

export interface CalculationResults {
  inputs: FormData;
  totalSheets: number;
  daysTillDeadline: number;
  weeksTillDeadline: number;
  requiredSlotsPerWeek: number;
  totalFee: number;
  preferredPlan: TimelineAnalysis;
  timelineScenarios: TimelineAnalysis[];
}
