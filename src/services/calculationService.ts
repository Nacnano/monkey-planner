import type {
  FormData,
  CalculationResults,
  TimelineAnalysis,
  CourseBreakdown,
  ExamDeadline,
} from "../types";

export const calculatePlan = (data: FormData): CalculationResults => {
  const { courses, exams, pricePerSlot, finalGoalExamId } = data;

  const totalSheets = courses.reduce(
    (sum, course) => sum + (course.sheetCount || 0),
    0
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDeadlines: ExamDeadline[] = exams
    .filter((exam) => exam.date)
    .map((exam) => {
      const deadlineDate = new Date(exam.date + "T00:00:00");
      const daysRemaining = Math.max(
        0,
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        id: exam.id,
        examName: exam.name || "Unnamed Exam",
        date: exam.date,
        daysRemaining,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const earliestDeadline = examDeadlines.length > 0 ? examDeadlines[0] : null;

  const finalGoalExam = exams.find((exam) => exam.id === finalGoalExamId);
  let finalGoalDeadline: ExamDeadline | null = null;
  if (finalGoalExam && finalGoalExam.date) {
    const deadlineDate = new Date(finalGoalExam.date + "T00:00:00");
    const daysRemaining = Math.max(
      0,
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    finalGoalDeadline = {
      id: finalGoalExam.id,
      examName: finalGoalExam.name || "Final Goal",
      date: finalGoalExam.date,
      daysRemaining,
    };
  }

  const requiredSlotsPerWeek = finalGoalDeadline
    ? (7 * totalSheets) / finalGoalDeadline.daysRemaining
    : 0;

  const totalFee = totalSheets * pricePerSlot;

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

    const targetDeadline = finalGoalDeadline || earliestDeadline;
    const isSuccess = targetDeadline
      ? daysToFinish <= targetDeadline.daysRemaining
      : true;

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

  const recommendedSlots =
    isFinite(requiredSlotsPerWeek) && requiredSlotsPerWeek > 0
      ? Math.ceil(requiredSlotsPerWeek)
      : 1;
  const recommendedPlan = calculateScenario(recommendedSlots);

  const timelineScenarios: TimelineAnalysis[] = [];
  const maxSlotsToDisplay = Math.max(10, Math.ceil(requiredSlotsPerWeek) + 5);

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
  };
};
