/**
 * Chart datasets shown in the Academic Task 1 popup, keyed by the writing
 * question id (e.g. "line-graph-1"). Each entry describes the visual that
 * accompanies the prompt — currently only line graphs are wired up, but
 * the discriminated union leaves room for bar / pie / table / etc.
 */
import type { LineGraphChartProps } from "@/components/site/charts/LineGraphChart";

export type Task1ChartData =
  | ({ kind: "line" } & LineGraphChartProps)
  // Future: | { kind: "bar"; ... } | { kind: "pie"; ... } | ...
  ;

export const writingTask1Charts: Record<string, Task1ChartData> = {
  "line-graph-1": {
    kind: "line",
    caption:
      "Source: BigIELTS — sample illustrative dataset (figures rounded to nearest cup).",
    xLabels: ["1995", "2000", "2005", "2010", "2015", "2020"],
    yMax: 30,
    yStep: 5,
    yUnit: "Cups per week (avg.)",
    series: [
      { name: "Sweden", color: "#0f766e", points: [24, 25.5, 27, 28, 27, 26] },
      { name: "Italy", color: "#b45309", points: [18, 18.5, 19, 19.5, 20, 20] },
      { name: "Germany", color: "#1d4ed8", points: [15, 16, 17, 18, 19, 20] },
      { name: "UK", color: "#9333ea", points: [7, 8, 10, 13, 16, 18] },
    ],
  },
};

export function hasTask1Chart(questionId: string): boolean {
  return Object.prototype.hasOwnProperty.call(writingTask1Charts, questionId);
}
