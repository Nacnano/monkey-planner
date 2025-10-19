import type {
  FormData,
  CalculationResults,
  TimelineAnalysis,
  CourseBreakdown,
  ExamDeadline,
} from "../types";

export const calculatePlan = (data: FormData): CalculationResults => {
  const { courses, exams, preferredSlots, pricePerSlot } = data;

  const totalSheets = courses.reduce(
    (sum, course) => sum + (course.sheetCount || 0),
    0
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDeadlines: ExamDeadline[] = exams
    .filter((exam) => exam.date)
    .map((exam) => {
      const deadlineDate = new Date(exam.date);
      deadlineDate.setHours(0, 0, 0, 0);
      const daysRemaining = Math.max(
        0,
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        examName: exam.name || "Unnamed Exam",
        date: exam.date,
        daysRemaining,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const criticalDeadline = examDeadlines.length > 0 ? examDeadlines[0] : null;

  const requiredSlotsPerWeek = criticalDeadline
    ? (7 * totalSheets) / criticalDeadline.daysRemaining
    : 0;

  const totalFee = totalSheets * pricePerSlot;

  const areAllDeadlinesMet = (slots: number): boolean => {
    if (slots <= 0) return false;
    if (!criticalDeadline) return true; // No deadlines means success by default

    const daysToFinish = (totalSheets / slots) * 7;
    return daysToFinish <= criticalDeadline.daysRemaining;
  };

  const calculateScenario = (slots: number): TimelineAnalysis => {
    if (slots <= 0) {
      return {
        slotsPerWeek: slots,
        weeksToFinish: Infinity,
        daysToFinish: Infinity,
        isSuccess: false,
        monthlyFee: 0,
        courseBreakdown: [],
      };
    }
    const weeksToFinish = totalSheets / slots;
    const daysToFinish = weeksToFinish * 7;
    const isSuccess = areAllDeadlinesMet(slots);
    const monthlyFee = (pricePerSlot * slots * 30) / 7;

    const courseBreakdown: CourseBreakdown[] = courses.map((course) => ({
      courseName: course.name || "Unnamed Course",
      daysToFinish: (course.sheetCount / slots) * 7,
    }));

    return {
      slotsPerWeek: slots,
      weeksToFinish,
      daysToFinish,
      isSuccess,
      monthlyFee,
      courseBreakdown,
    };
  };

  const preferredPlan = calculateScenario(preferredSlots);

  const timelineScenarios: TimelineAnalysis[] = [];
  const maxSlotsToDisplay = Math.max(
    10,
    Math.ceil(requiredSlotsPerWeek) + 2,
    preferredSlots + 2
  );

  for (let i = 1; i <= maxSlotsToDisplay; i++) {
    timelineScenarios.push(calculateScenario(i));
  }

  return {
    inputs: data,
    totalSheets,
    examDeadlines,
    requiredSlotsPerWeek,
    totalFee,
    preferredPlan,
    timelineScenarios,
  };
};
