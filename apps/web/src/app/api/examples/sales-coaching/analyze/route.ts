import { NextRequest, NextResponse } from "next/server";

interface InsightItem {
  type: "win" | "risk" | "action";
  title: string;
  quote: string;
  tip: string;
  timestamp: string;
  confidence: number;
}

export async function POST(request: NextRequest) {
  try {
    const { transcriptUrl, transcriptContent } = await request.json();

    // This is where you would implement the actual Supavec workflow:

    // 1. INGEST: Get transcript data
    let transcript = "";
    if (transcriptUrl) {
      // Extract Fireflies meeting ID from URL
      const meetingId = extractFirefliesMeetingId(transcriptUrl);
      if (meetingId && process.env.FIREFLIES_API_TOKEN) {
        // Call Fireflies API: GET /transcript?id={meetingId}
        transcript = await fetchFirefliesTranscript(meetingId);
      } else {
        return NextResponse.json(
          { error: "Invalid Fireflies URL or missing API token" },
          { status: 400 },
        );
      }
    } else if (transcriptContent) {
      transcript = transcriptContent;
    } else {
      return NextResponse.json(
        { error: "No transcript provided" },
        { status: 400 },
      );
    }

    // 2. EMBED: Send to Supavec embedding endpoint
    const embeddingResponse = await fetch(
      `${process.env.SUPAVEC_API_URL}/embed`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SUPAVEC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspace_id: process.env.SUPAVEC_WORKSPACE_ID,
          documents: [
            {
              content: transcript,
              metadata: {
                type: "sales_call",
                timestamp: new Date().toISOString(),
              },
            },
          ],
        }),
      },
    );

    if (!embeddingResponse.ok) {
      throw new Error("Failed to embed transcript");
    }

    const embeddingResult = await embeddingResponse.json();

    // 3. QUERY & ANALYZE: Use coaching prompts
    const coachingPrompt = `
    Analyze this sales call transcript and identify:
    1. WINS: What did the sales rep do well? Look for good discovery questions, value demonstration, relationship building.
    2. RISKS: What opportunities were missed? Look for unaddressed objections, lack of qualifying questions, missed pain points.
    3. ACTIONS: What specific next steps should be taken? Look for commitments made, follow-ups needed, additional stakeholders to involve.

    For each insight, provide:
    - The exact quote that supports your analysis
    - Specific coaching advice
    - A confidence score (0-1)
    
    Focus on actionable insights that will help improve future sales performance.
    `;

    const queryResponse = await fetch(`${process.env.SUPAVEC_API_URL}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SUPAVEC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspace_id: process.env.SUPAVEC_WORKSPACE_ID,
        query: coachingPrompt,
        top_k: 5,
        include_metadata: true,
      }),
    });

    if (!queryResponse.ok) {
      throw new Error("Failed to query transcript");
    }

    const queryResult = await queryResponse.json();

    // 4. SURFACE INSIGHTS: Parse LLM response into structured insights
    const insights = parseInsightsFromLLMResponse(queryResult.response);

    return NextResponse.json({
      success: true,
      summary: generateSummary(insights),
      insights,
      metadata: {
        duration: extractDuration(transcript),
        speakers: extractSpeakers(transcript),
        totalChunks: queryResult.chunks?.length || 0,
      },
    });
  } catch (error) {
    console.error("Sales coaching analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze transcript" },
      { status: 500 },
    );
  }
}

// Helper functions (would be implemented in production)
function extractFirefliesMeetingId(url: string): string | null {
  const match = url.match(/fireflies\.ai\/view\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

async function fetchFirefliesTranscript(meetingId: string): Promise<string> {
  // Implementation would call Fireflies API
  throw new Error("Fireflies integration not implemented in example");
}

function parseInsightsFromLLMResponse(response: string): InsightItem[] {
  // Implementation would parse LLM response into structured insights
  // This would use the retrieved chunks and their timestamps
  return [];
}

function generateSummary(insights: InsightItem[]): string {
  // Generate overall call summary based on insights
  return "Call analysis completed successfully.";
}

function extractDuration(transcript: string): string {
  // Extract call duration from transcript
  return "32:15";
}

function extractSpeakers(transcript: string): string[] {
  // Extract speaker names from transcript
  return ["Sales Rep", "Prospect"];
}
