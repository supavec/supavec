# Sales Coaching AI Example

A comprehensive sales coaching demonstration powered by Supavec RAG that analyzes call transcripts and provides actionable coaching insights.

## ✨ Features

- **Real-time Transcript Analysis**: Upload .srt/.vtt files for instant analysis
- **Supavec RAG Integration**: Uses real vector embeddings and semantic search
- **AI-Powered Coaching Insights**: Generates wins, risks, and action items
- **Confidence Scoring**: Each insight includes a confidence percentage
- **Interactive UI**: Modern interface with color-coded insight cards

## 🚀 How It Works

1. **Upload**: User uploads a sales call transcript (.srt or .vtt file)
2. **Embed**: Transcript is chunked and embedded using Supavec's `/upload_text` endpoint
3. **Query**: Multiple coaching-specific queries are run against the embedded content
4. **Analyze**: AI generates structured coaching insights with quotes and tips
5. **Display**: Results are shown in an intuitive dashboard format

## 🛠️ Technical Implementation

### API Integration

The example demonstrates a complete RAG workflow:

```typescript
// 1. Upload transcript to Supavec
const fileId = await uploadTranscriptToSupavec(transcript, fileName);

// 2. Query for coaching insights
const coachingQueries = [
  "What sales techniques were used effectively?",
  "What objections were raised and handled?",
  "What opportunities were missed?",
  // ... more queries
];

// 3. Generate insights from search results
for (const query of coachingQueries) {
  const searchResult = await searchSupavec(query, fileId);
  const insight = generateInsightFromResults(query, searchResult);
}
```

### Environment Variables

Add these to your `.env.local`:

```bash
SUPAVEC_API_URL="https://api.supavec.com"
SUPAVEC_API_KEY="your_supavec_api_key_here"
```

### File Structure

```
src/app/examples/sales-coaching/
├── page.tsx              # Main UI component
├── README.md             # This documentation
└── /api/
    └── analyze/
        └── route.ts       # API endpoint with Supavec integration
```

## 📊 Insight Types

The system generates three types of coaching insights:

- **🟢 Wins**: Effective techniques and successful moments
- **🟠 Risks**: Missed opportunities and areas for improvement  
- **🔵 Actions**: Specific next steps and follow-up items

Each insight includes:
- Relevant quote from the transcript
- Actionable coaching tip
- Confidence score (60-95%)
- Timestamp for easy reference

## 🎯 Business Value

### For Sales Teams
- **Immediate Feedback**: Get coaching insights right after calls
- **Consistent Standards**: AI ensures uniform evaluation criteria
- **Skill Development**: Targeted tips for improvement areas
- **Best Practice Sharing**: Identify and replicate successful techniques

### For Sales Managers
- **Scalable Coaching**: Analyze multiple calls simultaneously
- **Data-Driven Insights**: Objective analysis based on conversation content
- **Training Prioritization**: Focus coaching on specific skill gaps
- **Performance Tracking**: Monitor improvement over time

## 🚀 Getting Started

1. **Setup Environment**:
   ```bash
   # Copy environment variables
   cp .env.example .env.local
   
   # Add your Supavec API key
   SUPAVEC_API_KEY="your_api_key_here"
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Test the Example**:
   - Navigate to `/examples/sales-coaching`
   - Download the sample transcript
   - Upload and analyze

## 📋 Production Deployment

### Required Services
- **Supavec Instance**: For vector embeddings and search
- **OpenAI API**: For generating coaching insights (via Supavec)
- **Next.js Application**: For the web interface

### Performance Considerations
- **Chunking Strategy**: 500 tokens with 50 token overlap for sales conversations
- **Query Optimization**: Limited to 6 coaching queries for response time
- **Caching**: Consider caching analysis results for repeated uploads
- **Rate Limiting**: Implement rate limiting for production use

### Security
- Store API keys securely using environment variables
- Validate file uploads (type, size, content)
- Implement proper error handling and logging
- Consider data retention policies for uploaded transcripts

## 🔧 Customization

### Adding New Coaching Queries
```typescript
const COACHING_QUERIES = [
  "What sales techniques were used effectively?",
  "How was objection handling performed?",
  "Your custom coaching question here...",
];
```

### Modifying Insight Generation
```typescript
function generateInsightFromResults(query: string, searchResults: SupavecSearchResponse) {
  // Customize how insights are generated from search results
  // Modify templates, scoring, or classification logic
}
```

### UI Customization
- Modify color schemes in `getInsightColor()`
- Add new insight types beyond win/risk/action
- Customize the dashboard layout and components

## 📚 Learn More

- [Supavec Documentation](https://docs.supavec.com/)
- [Sales Coaching Best Practices](#)
- [RAG Implementation Guide](#)

---

*This example demonstrates the power of combining structured data (transcripts) with AI-powered analysis to create actionable business insights.* 