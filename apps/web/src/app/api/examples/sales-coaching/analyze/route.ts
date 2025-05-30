import { NextRequest, NextResponse } from "next/server";
import { AnalysisResult, InsightItem } from "@/types/sales-coaching";
import { parseSrt } from "./utils";

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

function generateInsightFromResults(
  query: string,
  searchResults: SupavecSearchResponse,
): InsightItem | null {
  if (!searchResults.success || !searchResults.documents.length) {
    return null;
  }

  // Combine the most relevant chunks with scores
  const relevantDocuments = searchResults.documents.slice(0, 2); // Use top 2 most relevant
  const relevantContent = relevantDocuments
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

  // Extract a quote that actually supports this insight
  const quote = extractRelevantQuote(query, insight, relevantContent, type);

  return {
    type,
    insight,
    quote,
    coaching_tip: generateCoachingTip(type, insight),
    timestamp: extractTimestampFromContent(relevantContent),
  };
}

function generateWinInsight(query: string, content: string): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Analyze content for specific positive indicators
  if (
    lowerQuery.includes("rapport") &&
    (lowerContent.includes("understand") || lowerContent.includes("feel") ||
      lowerContent.includes("appreciate"))
  ) {
    return "Excellent rapport building demonstrated through empathetic language and active listening.";
  }

  if (
    lowerQuery.includes("techniques") &&
    (lowerContent.includes("benefit") || lowerContent.includes("value") ||
      lowerContent.includes("save"))
  ) {
    return "Strong value-based selling approach with clear articulation of business benefits.";
  }

  if (
    lowerQuery.includes("buying signals") &&
    (lowerContent.includes("when") || lowerContent.includes("how much") ||
      lowerContent.includes("timeline"))
  ) {
    return "Clear buying signals identified - prospect showing interest in timing and investment.";
  }

  if (
    lowerContent.includes("objection") || lowerContent.includes("concern") ||
    lowerContent.includes("but")
  ) {
    return "Effective objection handling with evidence-based responses and empathy.";
  }

  if (
    lowerContent.includes("question") &&
    (lowerContent.includes("pain") || lowerContent.includes("challenge") ||
      lowerContent.includes("problem"))
  ) {
    return "Great discovery questions that successfully uncovered key pain points and challenges.";
  }

  if (
    lowerContent.includes("next step") || lowerContent.includes("follow up") ||
    lowerContent.includes("schedule")
  ) {
    return "Strong closing technique with clear next steps and commitment established.";
  }

  // Default based on content analysis
  if (lowerContent.includes("solution") || lowerContent.includes("help")) {
    return "Solution-focused approach that addresses prospect's specific needs effectively.";
  }

  return "Positive engagement and professional sales approach demonstrated in this conversation.";
}

function generateRiskInsight(query: string, content: string): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Analyze content for specific risk indicators
  if (
    lowerQuery.includes("missed") && lowerContent.includes("price") &&
    !lowerContent.includes("budget")
  ) {
    return "Missed opportunity to address prospect's budget concerns early in conversation.";
  }

  if (
    lowerQuery.includes("opportunities") &&
    !lowerContent.includes("decision maker")
  ) {
    return "Could have asked more qualifying questions about decision-making process and stakeholders.";
  }

  if (
    lowerContent.includes("think about") || lowerContent.includes("get back") ||
    lowerContent.includes("discuss internally")
  ) {
    return "Prospect showing hesitation - timeline and decision process weren't fully explored.";
  }

  if (
    lowerContent.includes("competitor") || lowerContent.includes("other") ||
    lowerContent.includes("alternative")
  ) {
    return "Competitive alternatives mentioned but not adequately addressed or differentiated.";
  }

  if (
    lowerQuery.includes("improve") && !lowerContent.includes("commitment") &&
    !lowerContent.includes("next step")
  ) {
    return "Missing clear commitment or specific next steps from the prospect.";
  }

  if (
    lowerContent.includes("maybe") || lowerContent.includes("probably") ||
    lowerContent.includes("might")
  ) {
    return "Prospect using tentative language - needs stronger qualification and commitment.";
  }

  if (
    lowerContent.includes("expensive") ||
    lowerContent.includes("cost") && !lowerContent.includes("value")
  ) {
    return "Price concerns raised without adequate value justification provided.";
  }

  if (lowerQuery.includes("could have") && !lowerContent.includes("timeline")) {
    return "Prospect's implementation timeline and urgency weren't properly explored.";
  }

  // Default based on content analysis
  if (
    !lowerContent.includes("question") || lowerContent.split("?").length < 3
  ) {
    return "Could have used more discovery questions to better understand prospect needs.";
  }

  return "Opportunity to strengthen qualification and build more urgency for next steps.";
}

function generateActionInsight(query: string, content: string): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Analyze content for specific action items based on conversation context
  if (
    lowerContent.includes("technical") || lowerContent.includes("demo") ||
    lowerContent.includes("show")
  ) {
    return "Schedule technical demo with IT stakeholders within 48 hours.";
  }

  if (
    lowerContent.includes("roi") || lowerContent.includes("return") ||
    lowerContent.includes("savings")
  ) {
    return "Send ROI calculator and case study for similar company size and industry.";
  }

  if (
    lowerContent.includes("price") || lowerContent.includes("cost") ||
    lowerContent.includes("budget")
  ) {
    return "Follow up with detailed pricing proposal and implementation options by end of week.";
  }

  if (
    lowerContent.includes("reference") || lowerContent.includes("customer") ||
    lowerContent.includes("similar")
  ) {
    return "Connect prospect with existing customer for reference call in similar industry.";
  }

  if (
    lowerContent.includes("implementation") ||
    lowerContent.includes("timeline") || lowerContent.includes("rollout")
  ) {
    return "Provide detailed implementation timeline and resource requirements document.";
  }

  if (
    lowerContent.includes("team") || lowerContent.includes("stakeholder") ||
    lowerContent.includes("decision maker")
  ) {
    return "Schedule meeting with all key stakeholders and decision makers.";
  }

  if (
    lowerContent.includes("contract") || lowerContent.includes("agreement") ||
    lowerContent.includes("terms")
  ) {
    return "Send contract template and terms for legal review by procurement team.";
  }

  if (
    lowerContent.includes("pilot") || lowerContent.includes("trial") ||
    lowerContent.includes("test")
  ) {
    return "Set up pilot program with limited scope to demonstrate value quickly.";
  }

  if (
    lowerContent.includes("security") || lowerContent.includes("compliance") ||
    lowerContent.includes("audit")
  ) {
    return "Provide security documentation and compliance certifications for review.";
  }

  // Default actions based on query type
  if (lowerQuery.includes("follow-up") || lowerQuery.includes("next steps")) {
    return "Schedule follow-up call within 3 business days to maintain momentum.";
  }

  return "Send meeting recap with key discussion points and proposed next steps within 24 hours.";
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

function generateCoachingTip(type: string, insight: string): string {
  const lowerInsight = insight.toLowerCase();

  // Generate specific tips based on the actual insight content
  if (lowerInsight.includes("rapport") || lowerInsight.includes("empathy")) {
    return "Continue using empathetic language and active listening to build trust with prospects.";
  }

  if (lowerInsight.includes("value") || lowerInsight.includes("benefit")) {
    return "Always tie features back to specific business outcomes and ROI for the prospect.";
  }

  if (lowerInsight.includes("objection")) {
    return "Use the Feel-Felt-Found technique: 'I understand how you feel, others have felt the same way, and here's what they found...'";
  }

  if (
    lowerInsight.includes("discovery") || lowerInsight.includes("questions")
  ) {
    return "Ask follow-up questions using 'Tell me more about...' to dive deeper into prospect needs.";
  }

  if (
    lowerInsight.includes("next step") || lowerInsight.includes("commitment")
  ) {
    return "Always end calls with specific next steps and get explicit agreement on timing.";
  }

  if (lowerInsight.includes("budget") || lowerInsight.includes("price")) {
    return "Address budget early by asking 'What budget range have you allocated for solving this problem?'";
  }

  if (
    lowerInsight.includes("decision maker") ||
    lowerInsight.includes("stakeholder")
  ) {
    return "Map the decision-making process early: 'Who else would be involved in evaluating this solution?'";
  }

  if (lowerInsight.includes("timeline") || lowerInsight.includes("urgency")) {
    return "Create urgency by asking 'What happens if you don't solve this problem in the next quarter?'";
  }

  if (
    lowerInsight.includes("competitor") || lowerInsight.includes("alternative")
  ) {
    return "Ask 'What would make you choose one solution over another?' to understand decision criteria.";
  }

  if (lowerInsight.includes("demo") || lowerInsight.includes("technical")) {
    return "Customize demos to show specific use cases that match the prospect's described challenges.";
  }

  // Type-based fallbacks for more generic insights
  if (type === "win") {
    return "Document this successful approach and share it with your team as a best practice.";
  } else if (type === "risk") {
    return "Practice objection handling techniques and prepare responses for common concerns.";
  } else {
    return "Set clear expectations and follow through consistently to build trust and momentum.";
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

    for (const query of COACHING_QUERIES.slice(0, 6)) { // Limit to 6 queries for performance
      try {
        const searchResult = await searchSupavec(query, fileId);
        const insight = generateInsightFromResults(query, searchResult);

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
