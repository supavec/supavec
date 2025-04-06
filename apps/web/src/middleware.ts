import { NextFetchEvent, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

async function sendTrackingData(url: string, userAgent: string) {
  try {
    await fetch(
      "https://ai-citations-web.vercel.app/api/track",
      // "http://localhost:3002/api/track",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: process.env.AI_CITATIONS_PROJECT_ID,
          url,
          userAgent,
        }),
      },
    );
    console.log("Successfully sent tracking data");
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Tracking request timed out");
    } else {
      console.error("Failed to send tracking data:", error);
    }
  }
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/ingest")) {
    const userAgent = request.headers.get("user-agent") || "";
    console.log("Middleware accessed with User-Agent:", userAgent);
    event.waitUntil(sendTrackingData(request.url, userAgent));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
