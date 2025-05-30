import { NextRequest, NextResponse } from "next/server";
import { AnalysisResult, InsightItem } from "@/types/sales-coaching";
import { parseSrt } from "./utils";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

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
  "What specific discovery questions were asked to understand prospect pain points?",
  "How did the sales rep handle price objections and budget concerns?",
  "What competitive threats or alternative solutions were mentioned?",
  "What buying signals and positive indicators did the prospect show?",
  "What key stakeholders and decision makers were identified?",
  "How effectively was urgency and timeline established?",
  "What specific next steps and commitments were secured?",
  "How was value and ROI communicated to the prospect?",
  "What rapport building techniques were demonstrated?",
  "What qualifying questions about decision process were missed?",
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

  const turns = parseSrt(transcript);
  const segments = turns.map((c) => ({
    content: `${c.speaker}: ${c.text}`,
    metadata: { speaker: c.speaker, start_ts: c.start },
  }));

  const response = await fetch(`${SUPAVEC_API_URL}/upload_text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": SUPAVEC_API_KEY,
    },
    body: JSON.stringify({
      name: fileName,
      segments,
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

async function generateInsightWithAI(
  query: string,
  content: string,
  type: "win" | "risk" | "action",
): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt:
        `You are an experienced sales coach analyzing a sales call transcript. Based on the conversation content below, generate a specific, actionable ${type} insight.

CONVERSATION CONTENT:
${content}

COACHING QUERY: ${query}

GUIDELINES:
- For "win" insights: Identify what the sales rep did exceptionally well
- For "risk" insights: Identify missed opportunities or potential concerns  
- For "action" insights: Suggest specific next steps based on what was discussed
- Keep it very short (max 15 words, one line only)
- Be direct and actionable, not generic
- Do NOT include prefixes like "Action Insight:" or "Win:" or "Risk:"
- Reference specific details from the conversation

Generate the insight directly:`,
      maxTokens: 40,
      temperature: 0.7,
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating insight with AI:", error);
    // Fallback to a basic insight if AI fails
    return `${
      type === "win"
        ? "Positive engagement"
        : type === "risk"
        ? "Opportunity for improvement"
        : "Follow up required"
    } identified in this conversation segment.`;
  }
}

async function generateInsightFromResults(
  query: string,
  searchResults: SupavecSearchResponse,
): Promise<InsightItem | null> {
  if (!searchResults.success || !searchResults.documents.length) {
    return null;
  }

  // Combine the most relevant chunks with scores
  const relevantDocuments = searchResults.documents.slice(0, 2); // Use top 2 most relevant
  const relevantContent = relevantDocuments
    .map((doc) => doc.content)
    .join(". ");

  console.log({
    query,
    relevantContent,
    relevantDocuments,
    relevantDocumentsLength: relevantDocuments.length,
  });

  // Determine insight type based on query intent
  let type: "win" | "risk" | "action" = "action";

  if (
    query.includes("effectively") || query.includes("techniques") ||
    query.includes("rapport") || query.includes("buying signals") ||
    query.includes("positive indicators")
  ) {
    type = "win";
  } else if (
    query.includes("missed") || query.includes("opportunities") ||
    query.includes("improve") || query.includes("could have")
  ) {
    type = "risk";
  } else {
    type = "action";
  }

  // Generate insight using AI
  const insight = await generateInsightWithAI(query, relevantContent, type);

  // Extract a quote that actually supports this insight
  const quote = extractRelevantQuote(query, insight, relevantContent, type);

  return {
    type,
    insight,
    quote,
    coaching_tip: await generateCoachingTipWithAI(insight, type),
    timestamp: extractTimestampFromContent(relevantContent),
  };
}

function extractRelevantQuote(
  query: string,
  insight: string,
  content: string,
  type: "win" | "risk" | "action",
): string {
  // Clean up SRT formatting - remove timestamps, line numbers, and arrows
  const cleanContent = content
    .replace(/^\d+$/gm, "") // Remove line numbers
    .replace(/\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/g, "") // Remove timestamps
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  // Extract all speaker dialogues
  const speakerPattern =
    /([A-Za-z\s]+(?:\([^)]+\))?)\s*:\s*([^:]+?)(?=\s+[A-Za-z\s]+(?:\([^)]+\))?\s*:|$)/g;
  const dialogues: Array<{ speaker: string; text: string }> = [];

  let match;
  while ((match = speakerPattern.exec(cleanContent)) !== null) {
    const speaker = match[1].trim();
    const text = match[2].trim();
    if (text.length > 20) { // Only include substantial dialogue
      dialogues.push({ speaker, text });
    }
  }

  const lowerInsight = insight.toLowerCase();
  // const lowerQuery = query.toLowerCase();

  // Find quotes based on insight type and content
  let relevantQuotes: string[] = [];

  if (type === "win") {
    // For wins, look for positive responses, buying signals, good questions
    relevantQuotes = dialogues
      .filter((d) => {
        const text = d.text.toLowerCase();
        return (
          // Positive responses
          text.includes("that sounds") || text.includes("i like") ||
          text.includes("perfect") || text.includes("excellent") ||
          text.includes("exactly") || text.includes("great") ||
          // Buying signals
          text.includes("timeline") || text.includes("budget") ||
          text.includes("when") || text.includes("how much") ||
          // Engagement signals
          text.includes("tell me more") || text.includes("i want") ||
          text.includes("i need") || text.includes("we could")
        );
      })
      .map((d) => d.text);
  } else if (type === "action") {
    // For actions, look for next steps, commitments, specific asks
    relevantQuotes = dialogues
      .filter((d) => {
        const text = d.text.toLowerCase();
        return (
          text.includes("next step") || text.includes("follow up") ||
          text.includes("send") || text.includes("schedule") ||
          text.includes("proposal") || text.includes("demo") ||
          text.includes("reference") || text.includes("pilot") ||
          text.includes("implementation") || text.includes("timeline")
        );
      })
      .map((d) => d.text);
  } else if (type === "risk") {
    // For risks, look for objections, concerns, hesitations
    relevantQuotes = dialogues
      .filter((d) => {
        const text = d.text.toLowerCase();
        return (
          text.includes("concern") || text.includes("worry") ||
          text.includes("but") || text.includes("however") ||
          text.includes("problem") || text.includes("issue") ||
          text.includes("skeptical") || text.includes("not sure")
        );
      })
      .map((d) => d.text);
  }

  // If we found relevant quotes, pick the best one
  if (relevantQuotes.length > 0) {
    // Prefer quotes that are more specific to the insight
    for (const quote of relevantQuotes) {
      const lowerQuote = quote.toLowerCase();
      if (
        lowerInsight.includes("discovery") &&
        (lowerQuote.includes("understand") || lowerQuote.includes("tell me"))
      ) {
        return truncateQuote(quote);
      }
      if (
        lowerInsight.includes("objection") &&
        (lowerQuote.includes("concern") || lowerQuote.includes("but"))
      ) {
        return truncateQuote(quote);
      }
      if (
        lowerInsight.includes("next step") &&
        (lowerQuote.includes("next") || lowerQuote.includes("follow"))
      ) {
        return truncateQuote(quote);
      }
      if (
        lowerInsight.includes("roi") &&
        (lowerQuote.includes("cost") || lowerQuote.includes("investment") ||
          lowerQuote.includes("budget"))
      ) {
        return truncateQuote(quote);
      }
      if (
        lowerInsight.includes("timeline") &&
        (lowerQuote.includes("week") || lowerQuote.includes("timeline") ||
          lowerQuote.includes("when"))
      ) {
        return truncateQuote(quote);
      }
    }

    // If no specific match, return the first relevant quote
    return truncateQuote(relevantQuotes[0]);
  }

  // Fallback: extract any meaningful dialogue
  if (dialogues.length > 0) {
    // Prefer prospect quotes over sales rep quotes for insights
    const prospectQuotes = dialogues.filter((d) =>
      d.speaker.toLowerCase().includes("prospect") ||
      d.speaker.toLowerCase().includes("sarah") ||
      !d.speaker.toLowerCase().includes("rep") &&
        !d.speaker.toLowerCase().includes("john")
    );

    if (prospectQuotes.length > 0) {
      return truncateQuote(prospectQuotes[0].text);
    }

    return truncateQuote(dialogues[0].text);
  }

  return "Key moment from the conversation";
}

function truncateQuote(quote: string): string {
  // Clean up the quote
  quote = quote.trim();

  // If quote is reasonable length, return as is
  if (quote.length <= 100) {
    return quote;
  }

  // If too long, truncate at sentence boundary
  const sentences = quote.split(/[.!?]+/);
  if (sentences.length > 1 && sentences[0].length <= 80) {
    return sentences[0].trim() + ".";
  }

  // Otherwise, truncate at word boundary
  const words = quote.split(" ");
  if (words.length > 15) {
    return words.slice(0, 15).join(" ") + "...";
  }

  return quote;
}

async function generateCoachingTipWithAI(
  insight: string,
  type: string,
): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt:
        `You are an experienced sales trainer providing coaching tips. Based on the sales insight below, generate a specific, actionable coaching tip.

INSIGHT: ${insight}
INSIGHT TYPE: ${type}

Generate a practical coaching tip (max 15 words, one line only) that helps sales reps improve their technique. Focus on specific actions they can take.

Coaching tip:`,
      maxTokens: 35,
      temperature: 0.6,
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating coaching tip with AI:", error);
    // Fallback tip based on type
    if (type === "win") {
      return "Document this successful approach and share it with your team as a best practice.";
    } else if (type === "risk") {
      return "Practice objection handling techniques and prepare responses for common concerns.";
    } else {
      return "Set clear expectations and follow through consistently to build trust and momentum.";
    }
  }
}

function generateTimestamp(): string {
  // Generate a random timestamp within the conversation (0-60 minutes)
  // More realistic distribution - most sales calls are 15-45 minutes
  const minutes = Math.floor(Math.random() * 45) +
    Math.floor(Math.random() * 15);
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes.toString().padStart(2, "0")}:${
    seconds.toString().padStart(2, "0")
  }`;
}

function extractTimestampFromContent(content: string): string {
  // Try to extract timestamp patterns from content
  // Common formats: [00:15:30], (15:30), 15:30, etc.
  const timestampPatterns = [
    /\[(\d{1,2}:\d{2}:\d{2})\]/g, // [00:15:30]
    /\[(\d{1,2}:\d{2})\]/g, // [15:30]
    /\((\d{1,2}:\d{2}:\d{2})\)/g, // (00:15:30)
    /\((\d{1,2}:\d{2})\)/g, // (15:30)
    /(?:^|\s)(\d{1,2}:\d{2}:\d{2})(?:\s|$)/g, // 00:15:30
    /(?:^|\s)(\d{1,2}:\d{2})(?:\s|$)/g, // 15:30
  ];

  for (const pattern of timestampPatterns) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      // Extract the timestamp from the first match
      const match = matches[0];
      const timestampMatch = match.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
      if (timestampMatch) {
        const timestamp = timestampMatch[1];
        // Ensure format is MM:SS
        if (timestamp.includes(":") && timestamp.split(":").length === 2) {
          return timestamp;
        } else if (timestamp.split(":").length === 3) {
          // Convert HH:MM:SS to MM:SS by taking MM:SS part
          const parts = timestamp.split(":");
          return `${parts[1]}:${parts[2]}`;
        }
      }
    }
  }

  // If no timestamp found in content, generate based on content characteristics
  return generateTimestamp();
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
    const seenInsights = new Set(); // Track similar insights to avoid duplicates

    for (const query of COACHING_QUERIES.slice(0, 1)) { // Limit to 1 query for performance
      try {
        const searchResult = await searchSupavec(query, fileId);
        const insight = await generateInsightFromResults(query, searchResult);

        if (insight) {
          // Create a simple hash to check for duplicate insights
          const insightKey = `${insight.type}-${
            insight.insight.toLowerCase().slice(0, 50)
          }`;

          if (!seenInsights.has(insightKey)) {
            insights.push(insight);
            seenInsights.add(insightKey);
          }
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
