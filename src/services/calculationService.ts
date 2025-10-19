import type { FormData, CalculationResults, TimelineAnalysis } from "../types";

export const calculatePlan = (data: FormData): CalculationResults => {
  const { courses, dueDate, preferredSlots, pricePerSlot } = data;

  const totalSheets = courses.reduce(
    (sum, course) => sum + course.sheetCount,
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

  // y = 7 * (x / d)
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
      };
    }
    const weeksToFinish = totalSheets / slots;
    const daysToFinish = weeksToFinish * 7;
    const isSuccess = daysToFinish <= daysTillDeadline;
    const monthlyFee = (pricePerSlot * slots * 30) / 7;

    return {
      slotsPerWeek: slots,
      weeksToFinish,
      daysToFinish,
      isSuccess,
      monthlyFee,
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
