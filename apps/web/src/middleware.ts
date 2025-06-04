import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { after } from "next/server";

async function sendTrackingData(url: string, userAgent: string) {
  try {
    await fetch(
      "https://www.citeanalytics.com/api/track",
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
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Tracking request timed out");
    } else {
      console.error("Failed to send tracking data:", error);
    }
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/ingest")) {
    const userAgent = request.headers.get("user-agent") || "";
    console.log("Middleware accessed with User-Agent:", userAgent);
    after(async () => {
      await sendTrackingData(request.url, userAgent);
    });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
