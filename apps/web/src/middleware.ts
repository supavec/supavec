import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (!path.startsWith("/ingest")) {
    const userAgent = request.headers.get("user-agent") || "";
    fetch(
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
      },
    ).catch(console.error);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
