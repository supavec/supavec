export type InsightItem = {
  type: "win" | "risk" | "action";
  insight: string;
  quote: string;
  coaching_tip: string;
  timestamp: string;
};

export type AnalysisSummary = {
  total_insights: number;
  wins: number;
  risks: number;
  actions: number;
};

export type AnalysisResult = {
  insights: InsightItem[];
  summary: AnalysisSummary;
};
