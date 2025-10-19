import type {
  FormData,
  CalculationResults,
  TimelineAnalysis,
  CourseBreakdown,
} from "../types";

export const calculatePlan = (data: FormData): CalculationResults => {
  const { courses, dueDate, preferredSlots, pricePerSlot } = data;

  const totalSheets = courses.reduce(
    (sum, course) => sum + (course.sheetCount || 0),
    0
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dueDate);
  deadline.setHours(0, 0, 0, 0);

  const daysTillDeadline = Math.max(
    0,
    (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeksTillDeadline = daysTillDeadline / 7;

  const requiredSlotsPerWeek =
    daysTillDeadline > 0 ? (7 * totalSheets) / daysTillDeadline : Infinity;

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
    const isSuccess = daysToFinish <= daysTillDeadline;
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
    daysTillDeadline,
    weeksTillDeadline,
    requiredSlotsPerWeek,
    totalFee,
    preferredPlan,
    timelineScenarios,
  };
};
