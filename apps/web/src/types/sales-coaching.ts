export interface InsightItem {
  type: "win" | "risk" | "action";
  insight: string;
  quote: string;
  coaching_tip: string;
  timestamp: string;
}

export interface AnalysisSummary {
  total_insights: number;
  wins: number;
  risks: number;
  actions: number;
}

export interface AnalysisResult {
  insights: InsightItem[];
  summary: AnalysisSummary;
}
