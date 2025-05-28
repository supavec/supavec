# Sales Coaching AI Example

This example showcases how Supavec's RAG technology can power intelligent sales coaching applications.

## How it works

1. **Input**: Upload a call transcript (.srt/.vtt file) or paste a Fireflies transcript URL
2. **Processing**: The transcript is processed through Supavec's embedding pipeline
3. **Analysis**: AI analyzes the conversation using coaching-specific prompts
4. **Insights**: Get actionable insights categorized as Wins, Risks, and Action Items

## Features demonstrated

- **Transcript Processing**: Handles both Fireflies URLs and uploaded transcript files
- **Vector Embedding**: Uses Supavec's /embed endpoint to create searchable vectors
- **Intelligent Querying**: Leverages /query endpoint with coaching-specific prompts
- **Contextual Citations**: Each insight includes the exact quote and timestamp
- **Deep Linking**: "Jump to timestamp" buttons that would link to original recordings

## Technical Implementation

In production, this example would:

1. **Ingest**: Pull transcript data from Fireflies API or parse uploaded files
2. **Embed**: Send chunked transcript to Supavec's embedding service
3. **Query**: Use RAG to find relevant conversation moments
4. **Analyze**: Pass relevant chunks to LLM for coaching analysis
5. **Present**: Display insights with citations and deep links

## Try it out

1. Download the sample transcript file provided
2. Upload it using the "Upload File" tab
3. Click "Analyze Call" to see the example in action

The insights you'll see demonstrate how AI can identify:
- Strong sales techniques (Wins)
- Missed opportunities (Risks) 
- Next steps to take (Actions)

Each insight includes the confidence level and coaching tips for improvement. 