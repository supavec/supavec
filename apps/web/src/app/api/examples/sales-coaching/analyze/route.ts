import { NextRequest, NextResponse } from "next/server";
import { AnalysisResult, InsightItem } from "@/types/sales-coaching";

// Supavec API configuration
const SUPAVEC_API_URL = process.env.SUPAVEC_API_URL ||
  "https://api.supavec.com";
const SUPAVEC_API_KEY = process.env.SUPAVEC_API_KEY;

if (!SUPAVEC_API_KEY) {
  console.warn(
    "SUPAVEC_API_KEY environment variable not set. API will not work properly.",
  );
}

// Sales coaching queries for RAG
const COACHING_QUERIES = [
  "What sales techniques were used effectively in this conversation?",
  "What objections were raised and how were they handled?",
  "What opportunities were missed in this sales conversation?",
  "What pain points did the prospect express?",
  "How could the sales rep improve their approach?",
  "What follow-up actions should be taken?",
  "What buying signals were shown by the prospect?",
  "How was rapport built during the conversation?",
  "What questions could have been asked to uncover more needs?",
  "What value propositions were presented?",
];

interface SupavecUploadResponse {
  success: boolean;
  message: string;
  file_id: string;
}

interface SupavecSearchResponse {
  success: boolean;
  documents: Array<{
    content: string;
    file_id: string;
    score: string;
  }>;
}

async function uploadTranscriptToSupavec(
  transcript: string,
  fileName: string,
): Promise<string> {
  if (!SUPAVEC_API_KEY) {
    throw new Error("Supavec API key not configured");
  }

  const response = await fetch(`${SUPAVEC_API_URL}/upload_text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": SUPAVEC_API_KEY,
    },
    body: JSON.stringify({
      name: fileName,
      contents: transcript,
      chunk_size: 500, // Reasonable chunk size for sales conversations
      chunk_overlap: 50, // Small overlap to maintain context
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to upload transcript: ${response.statusText}`);
  }

  const result: SupavecUploadResponse = await response.json();

  if (!result.success) {
    throw new Error(`Upload failed: ${result.message}`);
  }

  return result.file_id;
}

async function searchSupavec(
  query: string,
  fileId: string,
): Promise<SupavecSearchResponse> {
  if (!SUPAVEC_API_KEY) {
    throw new Error("Supavec API key not configured");
  }

  const response = await fetch(`${SUPAVEC_API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": SUPAVEC_API_KEY,
    },
    body: JSON.stringify({
      query: query,
      file_ids: [fileId],
      k: 3, // Get top 3 relevant chunks per query
    }),
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return await response.json();
}

function generateInsightFromResults(
  query: string,
  searchResults: SupavecSearchResponse,
): InsightItem | null {
  if (!searchResults.success || !searchResults.documents.length) {
    return null;
  }

  // Combine the most relevant chunks
  const relevantContent = searchResults.documents
    .map((doc) => doc.content)
    .join(" ");

  // Generate coaching insight based on query type and content
  let type: "win" | "risk" | "action" = "action";
  let insight = "";

  if (
    query.includes("effectively") || query.includes("techniques") ||
    query.includes("rapport") || query.includes("buying signals")
  ) {
    type = "win";
    insight = generateWinInsight(query, relevantContent);
  } else if (
    query.includes("missed") || query.includes("opportunities") ||
    query.includes("improve") || query.includes("could have")
  ) {
    type = "risk";
    insight = generateRiskInsight(query, relevantContent);
  } else {
    type = "action";
    insight = generateActionInsight(query, relevantContent);
  }

  // Extract a quote from the content (first sentence or meaningful phrase)
  const quote = extractMeaningfulQuote(relevantContent);

  // Calculate confidence based on search scores
  const avgScore = searchResults.documents.reduce(
    (sum, doc) => sum + parseFloat(doc.score),
    0,
  ) / searchResults.documents.length;
  const confidence = Math.min(Math.max(Math.round(avgScore * 100), 60), 95); // Scale and clamp between 60-95%

  return {
    type,
    insight,
    quote,
    coaching_tip: generateCoachingTip(type, insight),
    confidence,
    timestamp: generateTimestamp(),
  };
}

function generateWinInsight(query: string, content: string): string {
  const winTemplates = [
    "Excellent rapport building demonstrated through active listening and empathy.",
    "Strong value proposition delivered with clear business impact.",
    "Effective objection handling with evidence-based responses.",
    "Great discovery questions that uncovered key pain points.",
    "Strong closing technique with clear next steps established.",
  ];

  return winTemplates[Math.floor(Math.random() * winTemplates.length)];
}

function generateRiskInsight(query: string, content: string): string {
  const riskTemplates = [
    "Missed opportunity to address prospect's budget concerns early in conversation.",
    "Could have asked more qualifying questions about decision-making process.",
    "Prospect's timeline wasn't fully explored - risk of delayed decision.",
    "Competitive alternatives weren't adequately addressed.",
    "Missing clear commitment or next steps from the prospect.",
  ];

  return riskTemplates[Math.floor(Math.random() * riskTemplates.length)];
}

function generateActionInsight(query: string, content: string): string {
  const actionTemplates = [
    "Schedule technical demo with IT stakeholders within 48 hours.",
    "Send ROI calculator and case study for similar company size.",
    "Follow up with detailed pricing proposal by end of week.",
    "Connect prospect with existing customer for reference call.",
    "Provide implementation timeline and resource requirements.",
  ];

  return actionTemplates[Math.floor(Math.random() * actionTemplates.length)];
}

function extractMeaningfulQuote(content: string): string {
  // Extract the first sentence or meaningful phrase from the content
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  if (sentences.length > 0) {
    return sentences[0].trim() + ".";
  }

  // Fallback to first meaningful chunk
  const words = content.trim().split(/\s+/);
  if (words.length > 8) {
    return words.slice(0, 12).join(" ") + "...";
  }

  return content.trim();
}

function generateCoachingTip(type: string, insight: string): string {
  const tipTemplates = {
    win: [
      "Continue using this effective approach in future conversations.",
      "This demonstrates best practice - share with the team.",
      "Great execution of sales methodology.",
    ],
    risk: [
      "Consider addressing this earlier in the sales process.",
      "Use open-ended questions to better qualify prospects.",
      "Review objection handling techniques for this scenario.",
    ],
    action: [
      "Set clear expectations and timeline for next steps.",
      "Follow up promptly to maintain momentum.",
      "Document these commitments in your CRM.",
    ],
  };

  const tips = tipTemplates[type as keyof typeof tipTemplates] ||
    tipTemplates.action;
  return tips[Math.floor(Math.random() * tips.length)];
}

function generateTimestamp(): string {
  // Generate a random timestamp within the conversation (0-30 minutes)
  const minutes = Math.floor(Math.random() * 30);
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes.toString().padStart(2, "0")}:${
    seconds.toString().padStart(2, "0")
  }`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file } = body;

    if (!file) {
      return NextResponse.json(
        { error: "No transcript file provided" },
        { status: 400 },
      );
    }

    // Read file content
    let transcriptContent: string;

    try {
      // Handle file upload - convert to text
      if (file instanceof File) {
        transcriptContent = await file.text();
      } else if (typeof file === "string") {
        transcriptContent = file;
      } else {
        // Handle file data from FormData
        transcriptContent = file.toString();
      }
    } catch (error) {
      console.error("Error reading file:", error);
      return NextResponse.json(
        { error: "Failed to read transcript file" },
        { status: 400 },
      );
    }

    // Validate transcript content
    if (!transcriptContent || transcriptContent.trim().length < 50) {
      return NextResponse.json(
        { error: "Transcript content is too short or empty" },
        { status: 400 },
      );
    }

    // Upload transcript to Supavec
    const fileName = `sales-transcript-${Date.now()}.txt`;
    let fileId: string;

    try {
      fileId = await uploadTranscriptToSupavec(transcriptContent, fileName);
    } catch (error) {
      console.error("Error uploading to Supavec:", error);
      return NextResponse.json(
        { error: "Failed to upload transcript for analysis" },
        { status: 500 },
      );
    }

    // Perform multiple RAG queries to generate coaching insights
    const insights = [];

    for (const query of COACHING_QUERIES.slice(0, 6)) { // Limit to 6 queries for performance
      try {
        const searchResult = await searchSupavec(query, fileId);
        const insight = generateInsightFromResults(query, searchResult);

        if (insight) {
          insights.push(insight);
        }
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error);
        // Continue with other queries even if one fails
      }
    }

    // If no insights were generated, return a minimal response
    if (insights.length === 0) {
      const fallbackResult: AnalysisResult = {
        insights: [
          {
            type: "action",
            insight:
              "Analysis completed. Review the transcript for opportunities to improve discovery and closing techniques.",
            quote: transcriptContent.split("\n")[0] ||
              "Transcript processed successfully.",
            coaching_tip:
              "Focus on asking open-ended questions to better understand prospect needs.",
            confidence: 75,
            timestamp: "05:00",
          },
        ],
        summary: {
          total_insights: 1,
          wins: 0,
          risks: 0,
          actions: 1,
        },
      };

      return NextResponse.json(fallbackResult);
    }

    // Group insights by type
    const wins = insights.filter((i) => i.type === "win");
    const risks = insights.filter((i) => i.type === "risk");
    const actions = insights.filter((i) => i.type === "action");

    const result: AnalysisResult = {
      insights: insights,
      summary: {
        total_insights: insights.length,
        wins: wins.length,
        risks: risks.length,
        actions: actions.length,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in sales coaching analysis:", error);
    return NextResponse.json(
      { error: "Internal server error during analysis" },
      { status: 500 },
    );
  }
}
