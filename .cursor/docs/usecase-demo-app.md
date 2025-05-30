# Supavec Workflow

| Step | What happens | Why Supavec is doing the heavy lift |
|------|--------------|-------------------------------------|
| **1. Ingest** | • User pastes a Fireflies transcript URL or uploads an .srt/.vtt file.<br>• If Fireflies API token is present, hit GET /transcript?id=… to pull JSON in one call (speaker labels, timestamps). | Transcript arrives ready-chunked → no audio processing needed. |
| **2. Embed** | Send the raw sentences (w/ speaker tags + timecodes) to POST /embed on Supavec. | Vector index is created instantly under the user's workspace; no infra for you. |
| **3. Query & Analyse** | • Fire a single /query call with a coaching prompt → "Return anything about next steps, price objections, competitor mentions, and the rep's talk-listen ratio."<br>• Feed retrieved chunks into an LLM that generates a Markdown Call Improvement Report with citations back to timestamps. | Supavec guarantees you only pass ~3–5 highly-relevant chunks to the LLM → latency stays < 1 s even on big calls. |
| **4. Surface insights** | Show three cards: Wins, Risks, Action Items. Each contains the cited quote, a quick tip, and a "Jump to 00:14:32" button that deep-links to the Fireflies recording. | Visual proof that insights are grounded—not hallucinated. |