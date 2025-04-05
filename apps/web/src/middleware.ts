import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/ingest")) {
    const userAgent = request.headers.get("user-agent") || "";
    console.log("Middleware accessed with User-Agent:", userAgent);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

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
            url: request.url,
            userAgent,
          }),
          signal: controller.signal,
        },
      );
      clearTimeout(timeoutId);
      console.log("Successfully sent tracking data");
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error("Tracking request timed out");
      } else {
        console.error("Failed to send tracking data:", error);
      }
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
