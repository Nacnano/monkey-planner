import type {
  FormData,
  CalculationResults,
  TimelineAnalysis,
  CourseBreakdown,
  ExamDeadline,
} from "../types";

export const calculatePlan = (data: FormData): CalculationResults => {
  const { courses, pricePerSlot } = data;

  const totalSheets = courses.reduce(
    (sum, course) => sum + (course.sheetCount || 0),
    0
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDeadlines: ExamDeadline[] = courses
    .filter((course) => course.examName && course.examDate)
    .map((course) => {
      const deadlineDate = new Date(course.examDate! + "T00:00:00");
      const daysRemaining = Math.max(
        0,
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        id: course.id,
        examName: course.examName || "Unnamed Exam",
        date: course.examDate!,
        daysRemaining,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  // Automatically determine the final goal as the latest deadline
  let finalGoalDeadline: ExamDeadline | undefined = undefined;
  if (examDeadlines.length > 0) {
    finalGoalDeadline = examDeadlines.reduce((latest, current) => {
      return current.daysRemaining > latest.daysRemaining ? current : latest;
    });
  }
  const finalGoalCourseId = finalGoalDeadline ? finalGoalDeadline.id : null;

  const requiredSlotsPerWeek = courses.reduce((totalSlots, course) => {
    let courseDeadline: ExamDeadline | undefined;
    // If the course has its own deadline defined
    if (course.examName && course.examDate) {
      courseDeadline = examDeadlines.find((d) => d.id === course.id);
    } else {
      // Otherwise, use the final goal deadline
      courseDeadline = finalGoalDeadline;
    }

    if (courseDeadline && courseDeadline.daysRemaining > 0) {
      const slotsForCourse =
        (7 * (course.sheetCount || 0)) / courseDeadline.daysRemaining;
      return totalSlots + slotsForCourse;
    }
    return totalSlots;
  }, 0);

  const totalFee = totalSheets * pricePerSlot;

  const calculateScenario = (slots: number): TimelineAnalysis => {
    if (slots <= 0) {
      return {
        slotsPerWeek: slots,
        weeksToFinish: Infinity,
        daysToFinish: Infinity,
        monthsToFinish: Infinity,
        isSuccess: false,
        monthlyFee: 0,
        courseBreakdown: [],
      };
    }
    const weeksToFinish = totalSheets / slots;
    const daysToFinish = weeksToFinish * 7;
    const monthsToFinish = daysToFinish / 30;

    const isSuccess = slots >= requiredSlotsPerWeek;

    const monthlyFee = (pricePerSlot * slots * 30) / 7;

    const courseBreakdown: CourseBreakdown[] = courses.map((course) => ({
      courseName: course.name || "Unnamed Course",
      daysToFinish: ((course.sheetCount || 0) / slots) * 7,
    }));

    return {
      slotsPerWeek: slots,
      weeksToFinish,
      daysToFinish,
      monthsToFinish,
      isSuccess,
      monthlyFee,
      courseBreakdown,
    };
  };

  const recommendedSlots =
    isFinite(requiredSlotsPerWeek) && requiredSlotsPerWeek > 0
      ? Math.ceil(requiredSlotsPerWeek)
      : 1;
  const recommendedPlan = calculateScenario(recommendedSlots);

  const timelineScenarios: TimelineAnalysis[] = [];
  const maxSlotsToDisplay = 7;

  for (let i = 1; i <= maxSlotsToDisplay; i++) {
    timelineScenarios.push(calculateScenario(i));
  }

  return {
    inputs: data,
    totalSheets,
    examDeadlines,
    requiredSlotsPerWeek,
    totalFee,
    recommendedPlan,
    timelineScenarios,
    finalGoalCourseId,
  };
};
