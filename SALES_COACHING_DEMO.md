# Sales Coaching AI Example

## Overview

The Sales Coaching AI Example showcases how Supavec's Retrieval-Augmented Generation (RAG) technology can power intelligent sales coaching applications. This example implements the workflow described in the use case document, providing a complete end-to-end example of AI-powered sales analysis.

## Features

### 📁 **Multi-Input Support**
- **Fireflies Integration**: Paste Fireflies transcript URLs for automatic processing
- **File Upload**: Support for .srt and .vtt transcript files
- **Sample Data**: Includes a downloadable sample transcript for testing

### 🎯 **AI-Powered Analysis**
- **Wins**: Identifies successful sales techniques and strategies
- **Risks**: Highlights missed opportunities and potential issues
- **Action Items**: Provides specific next steps and recommendations

### 📊 **Rich Insights Display**
- **Confidence Scores**: Each insight includes an AI confidence percentage
- **Contextual Citations**: Direct quotes from the conversation with timestamps
- **Coaching Tips**: Actionable advice for sales improvement
- **Deep Linking**: "Jump to timestamp" buttons for Fireflies recordings

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Interactive Components**: Tabs, cards, and smooth animations
- **Accessibility**: ARIA-compliant with proper keyboard navigation
- **Dark/Light Mode**: Automatic theme detection and switching

## Architecture

### Example Workflow

1. **Input Processing**
   - User provides transcript via URL or file upload
   - File validation for .srt/.vtt formats
   - URL parsing for Fireflies integration

2. **Supavec Integration** (Production)
   ```
   Transcript → Supavec Embed → Vector Index → Query → LLM Analysis → Insights
   ```

3. **Analysis Engine**
   - Chunked transcript processing
   - Contextual vector search
   - AI-powered coaching analysis
   - Structured insight generation

4. **Results Display**
   - Categorized insights (Wins/Risks/Actions)
   - Citation with timestamps
   - Confidence scoring
   - Interactive UI components

### Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS, Lucide Icons
- **State Management**: React hooks (useState)
- **File Handling**: React Dropzone
- **Notifications**: Sonner toast library

## Usage

### Getting Started

1. **Access the Example**
   - Navigate to `/examples/sales-coaching`
   - Available from main navigation or footer

2. **Try with Sample Data**
   - Download the provided sample transcript
   - Upload via the "Upload File" tab
   - Click "Analyze Call" to see results

3. **Use Your Own Data**
   - Paste a Fireflies transcript URL, or
   - Upload your own .srt/.vtt file

### Understanding Results

**Wins (Green Cards)**
- Successful sales techniques
- Strong discovery questions
- Effective value demonstrations
- Good relationship building

**Risks (Orange Cards)**
- Missed opportunities
- Unaddressed objections
- Lack of qualifying questions
- Competitive threats

**Action Items (Blue Cards)**
- Specific next steps
- Follow-up requirements
- Stakeholder engagement
- Process improvements

## Production Implementation

### API Integration

The example includes a production-ready API route at `/api/examples/sales-coaching/analyze` that demonstrates:

1. **Fireflies API Integration**
   ```typescript
   const transcript = await fetchFirefliesTranscript(meetingId);
   ```

2. **Supavec Embedding**
   ```typescript
   const embeddingResponse = await fetch(`${SUPAVEC_API_URL}/embed`, {
     method: 'POST',
     headers: { 'Authorization': `Bearer ${SUPAVEC_API_KEY}` },
     body: JSON.stringify({ workspace_id, documents })
   });
   ```

3. **RAG Query Processing**
   ```typescript
   const queryResponse = await fetch(`${SUPAVEC_API_URL}/query`, {
     method: 'POST',
     body: JSON.stringify({ workspace_id, query: coachingPrompt, top_k: 5 })
   });
   ```

### Environment Variables

For production deployment, configure:

```env
SUPAVEC_API_URL=https://api.supavec.com
SUPAVEC_API_KEY=your_api_key
SUPAVEC_WORKSPACE_ID=your_workspace_id
FIREFLIES_API_TOKEN=your_fireflies_token
```

### Coaching Prompts

The demo uses sophisticated prompting for analysis:

```
Analyze this sales call transcript and identify:
1. WINS: What did the sales rep do well?
2. RISKS: What opportunities were missed?
3. ACTIONS: What specific next steps should be taken?

For each insight, provide:
- The exact quote that supports your analysis
- Specific coaching advice
- A confidence score (0-1)
```

## Customization

### Adding New Insight Types

1. Extend the `InsightCard` interface:
   ```typescript
   interface InsightCard {
     type: 'win' | 'risk' | 'action' | 'opportunity';
     // ... other properties
   }
   ```

2. Update UI components:
   ```typescript
const getInsightIcon = (type: InsightCard['type']) => {
  switch (type) {
    case 'opportunity':
      return <Lightbulb className="h-5 w-5 text-purple-500" />;
    // handle other types...
    default:
      return null;
  }
};
### Custom Prompting

Modify the coaching prompts in the API route to focus on specific sales methodologies:

- BANT qualification
- SPIN selling
- Challenger sale
- Solution selling
- Consultative selling

### Branding

Update the demo with your brand:

1. Replace logo in `/public/logo.png`
2. Update `siteConfig` in `/lib/config.ts`
3. Customize color scheme in `tailwind.config.ts`

## Business Value

### For Sales Teams
- **Instant Feedback**: Real-time coaching insights
- **Consistent Training**: Standardized coaching criteria
- **Performance Tracking**: Quantified improvement metrics
- **Best Practice Sharing**: Identify and replicate winning techniques

### For Sales Managers
- **Scalable Coaching**: AI-assisted team development
- **Data-Driven Insights**: Objective performance analysis
- **Time Efficiency**: Automated call review processes
- **Pipeline Improvement**: Earlier identification of deal risks

### For Organizations
- **Revenue Impact**: Improved sales effectiveness
- **Training ROI**: Reduced coaching time and costs
- **Competitive Advantage**: AI-powered sales intelligence
- **Knowledge Retention**: Systematic capture of sales best practices

## Example Limitations

This is a demonstration version with the following limitations:

- **Mock Data**: Uses simulated analysis results
- **No Real API Calls**: Fireflies and Supavec integration is stubbed
- **Sample Insights**: Pre-generated coaching recommendations
- **Limited File Types**: Only .srt and .vtt supported

For production use, integrate with actual Supavec and Fireflies APIs as shown in the example API route.

## Next Steps

1. **API Integration**: Connect to real Supavec and Fireflies services
2. **Data Storage**: Implement call history and coaching metrics
3. **Team Features**: Add multi-user support and team dashboards
4. **Advanced Analytics**: Include trend analysis and performance tracking
5. **Mobile App**: Create companion mobile application
6. **Integrations**: Connect with CRM systems and sales tools

## Support

For questions about implementing this demo or integrating with Supavec:

- **Documentation**: [docs.supavec.com](https://docs.supavec.com)
- **Discord**: [Join our community](https://go.supavec.com/discord)
- **GitHub**: [supavec/supavec](https://github.com/taishikato/supavec)
- **Email**: support@supavec.com 