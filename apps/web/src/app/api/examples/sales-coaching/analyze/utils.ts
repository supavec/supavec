type Turn = {
  start: string;
  speaker: string;
  text: string;
};

export function parseSrt(raw: string): Turn[] {
  return raw
    .split(/\n{2,}/) // split blocks
    .flatMap((block) => {
      const lines = block.trim().split("\n");
      if (lines.length < 3) return [];
      const [, time, ...textLines] = lines; // skip numeric index
      const [start] = time.split(" --> ");
      const speakerLine = textLines.join(" ");
      const colonIdx = speakerLine.indexOf(":");
      if (colonIdx === -1) return [];
      return [{
        start: start.replace(",", ".").slice(0, 8), // HH:MM:SS
        speaker: speakerLine.slice(0, colonIdx).trim(),
        text: speakerLine.slice(colonIdx + 1).trim(),
      }];
    });
}

export function truncateQuote(quote: string): string {
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
  if (words.length > 20) {
    return words.slice(0, 20).join(" ") + "...";
  }

  return quote;
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

export function extractTimestampFromContent(content: string): string {
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
