import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const contentPath = join(
      process.cwd(),
      "src/content/llms.md",
    );
    const content = readFileSync(contentPath, "utf-8");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error reading llms.md file:", error);
    return new NextResponse("Error loading content", { status: 500 });
  }
}
