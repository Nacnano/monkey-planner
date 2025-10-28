import type {
  FormData,
  CalculationResults,
  TimelineAnalysis,
  CourseBreakdown,
  ExamDeadline,
  DeadlineSuccessStatus,
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

  let finalGoalDeadline: ExamDeadline | undefined = undefined;
  if (examDeadlines.length > 0) {
    finalGoalDeadline = examDeadlines.reduce((latest, current) => {
      return current.daysRemaining > latest.daysRemaining ? current : latest;
    });
  }
  const finalGoalCourseId = finalGoalDeadline ? finalGoalDeadline.id : null;

  let cumulativeSheets = 0;
  const requiredPaces: number[] = [];
  const deadlineMap = new Map<string, ExamDeadline>(
    examDeadlines.map((d) => [d.id, d])
  );

  for (const course of courses) {
    cumulativeSheets += course.sheetCount || 0;

    const effectiveDeadline = deadlineMap.get(course.id) || finalGoalDeadline;

    if (effectiveDeadline && effectiveDeadline.daysRemaining > 0) {
      const paceNeeded =
        (cumulativeSheets / effectiveDeadline.daysRemaining) * 7;
      requiredPaces.push(paceNeeded);
    }
  }

  const requiredSlotsPerWeek = Math.max(0, ...requiredPaces);

  const totalFee = totalSheets * pricePerSlot;

  const calculateScenario = (
    slots: number,
    allDeadlines: ExamDeadline[]
  ): TimelineAnalysis => {
    if (slots <= 0) {
      return {
        slotsPerWeek: slots,
        weeksToFinish: Infinity,
        daysToFinish: Infinity,
        monthsToFinish: Infinity,
        isSuccess: false,
        monthlyFee: 0,
        courseBreakdown: [],
        deadlineSuccess: [],
      };
    }
    const weeksToFinish = totalSheets / slots;
    const daysToFinish = weeksToFinish * 7;
    const monthsToFinish = daysToFinish / 30;

    const isSuccess = finalGoalDeadline
      ? daysToFinish <= finalGoalDeadline.daysRemaining
      : true;

    const monthlyFee = (pricePerSlot * slots * 30) / 7;

    const courseBreakdown: CourseBreakdown[] = courses.map((course) => ({
      courseName: course.name || "Unnamed Course",
      daysToFinish: ((course.sheetCount || 0) / slots) * 7,
    }));

    let cumulativeDays = 0;
    const courseFinishDays = new Map<string, number>();
    for (const course of courses) {
      const daysForCourse = ((course.sheetCount || 0) / slots) * 7;
      cumulativeDays += daysForCourse;
      courseFinishDays.set(course.id, cumulativeDays);
    }

    const deadlineSuccess: DeadlineSuccessStatus[] = allDeadlines.map(
      (deadline) => {
        const finishDayForCourse = courseFinishDays.get(deadline.id);
        const isDeadlineMet =
          finishDayForCourse !== undefined &&
          finishDayForCourse <= deadline.daysRemaining;
        return {
          deadlineId: deadline.id,
          isSuccess: isDeadlineMet,
        };
      }
    );

    return {
      slotsPerWeek: slots,
      weeksToFinish,
      daysToFinish,
      monthsToFinish,
      isSuccess,
      monthlyFee,
      courseBreakdown,
      deadlineSuccess,
    };
  };

  const recommendedSlots =
    isFinite(requiredSlotsPerWeek) && requiredSlotsPerWeek > 0
      ? Math.ceil(requiredSlotsPerWeek)
      : 1;
  const recommendedPlan = calculateScenario(recommendedSlots, examDeadlines);

  const timelineScenarios: TimelineAnalysis[] = [];
  const maxSlotsToDisplay = 7;

  for (let i = 1; i <= maxSlotsToDisplay; i++) {
    timelineScenarios.push(calculateScenario(i, examDeadlines));
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
