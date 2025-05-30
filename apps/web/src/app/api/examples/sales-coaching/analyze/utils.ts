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
