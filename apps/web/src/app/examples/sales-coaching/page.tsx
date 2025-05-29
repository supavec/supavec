"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Play,
  CheckCircle,
  AlertTriangle,
  Target,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface InsightCard {
  type: "win" | "risk" | "action";
  title: string;
  quote: string;
  tip: string;
  timestamp: string;
  confidence: number;
}

interface AnalysisResult {
  summary: string;
  insights: InsightCard[];
  metadata: {
    duration: string;
    speakers: string[];
    totalChunks: number;
  };
}

export default function SalesCoachingExample() {
  const [transcriptUrl, setTranscriptUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("url");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith(".srt") || file.name.endsWith(".vtt"))) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    } else {
      toast.error("Please upload a valid .srt or .vtt file");
    }
  };

  const processTranscript = async () => {
    if (!transcriptUrl && !uploadedFile) {
      toast.error("Please provide a transcript URL or upload a file");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate the Supavec workflow
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate embedding

      // Mock analysis result
      const mockResult: AnalysisResult = {
        summary:
          "Call analysis completed successfully. The sales rep demonstrated strong product knowledge but missed several qualifying questions. Key opportunities for improvement include active listening and objection handling.",
        insights: [
          {
            type: "win",
            title: "Strong Product Demo",
            quote:
              "I love how you walked through the ROI calculator step by step. That really helped me understand the value.",
            tip: "Great use of interactive demonstrations to build value. Continue using hands-on approaches to showcase product benefits.",
            timestamp: "00:14:32",
            confidence: 0.92,
          },
          {
            type: "risk",
            title: "Missed Qualifying Question",
            quote:
              "Well, we're looking at a few different solutions right now...",
            tip: "When prospects mention competitors, dig deeper to understand decision criteria and timeline. Ask: 'What's most important to you in making this decision?'",
            timestamp: "00:08:15",
            confidence: 0.87,
          },
          {
            type: "action",
            title: "Follow Up on Budget Discussion",
            quote:
              "Budget is always a consideration, but if the ROI is there...",
            tip: "Send a customized ROI analysis based on their specific numbers. Schedule a follow-up to review together.",
            timestamp: "00:22:45",
            confidence: 0.94,
          },
          {
            type: "risk",
            title: "Didn't Address Implementation Concerns",
            quote:
              "Our IT team is pretty stretched thin right now with the ERP rollout...",
            tip: "Acknowledge implementation challenges and present your support resources. Offer to speak directly with their IT team.",
            timestamp: "00:18:20",
            confidence: 0.89,
          },
          {
            type: "win",
            title: "Good Discovery on Pain Points",
            quote:
              "We're spending about 15 hours a week on manual reporting, and errors are creeping in...",
            tip: "Excellent discovery! You uncovered both time costs and quality issues. Reference this pain throughout your follow-up.",
            timestamp: "00:06:12",
            confidence: 0.95,
          },
          {
            type: "action",
            title: "Schedule Technical Deep Dive",
            quote:
              "I'd need to see how this integrates with our existing CRM...",
            tip: "Set up a technical call with their CRM admin. Prepare integration documentation and common use cases beforehand.",
            timestamp: "00:26:08",
            confidence: 0.91,
          },
        ],
        metadata: {
          duration: "32:15",
          speakers: ["Sales Rep (John)", "Prospect (Sarah)"],
          totalChunks: 45,
        },
      };

      setAnalysisResult(mockResult);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      toast.error("Failed to process transcript. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getInsightIcon = (type: InsightCard["type"]) => {
    switch (type) {
      case "win":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "risk":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "action":
        return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightColor = (type: InsightCard["type"]) => {
    switch (type) {
      case "win":
        return "bg-green-50 border-green-200";
      case "risk":
        return "bg-orange-50 border-orange-200";
      case "action":
        return "bg-blue-50 border-blue-200";
    }
  };

  const openFirefliesLink = (timestamp: string) => {
    // Simulate opening Fireflies recording at specific timestamp
    toast.info(`Opening Fireflies recording at ${timestamp}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sales Coaching AI Example</h1>
        <p className="text-muted-foreground">
          Upload a call transcript or paste a Fireflies URL to get instant
          coaching insights powered by Supavec RAG.
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Transcript
          </CardTitle>
          <CardDescription>
            Provide a Fireflies transcript URL or upload an .srt/.vtt file to
            analyze.{" "}
            <a
              href="/sample-transcript.srt"
              download
              className="text-primary hover:underline font-medium"
            >
              Download sample transcript
            </a>{" "}
            to test the example.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Fireflies URL</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transcript-url">Fireflies Transcript URL</Label>
                <Input
                  id="transcript-url"
                  placeholder="https://app.fireflies.ai/view/..."
                  value={transcriptUrl}
                  onChange={(e) => setTranscriptUrl(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transcript-file">Upload Transcript File</Label>
                <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 h-32 flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div className="text-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                    <div className="text-sm text-muted-foreground">
                      <label
                        htmlFor="transcript-file"
                        className="font-medium text-primary hover:text-primary/80 cursor-pointer"
                      >
                        Choose a file
                      </label>{" "}
                      or drag and drop
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SRT, VTT files only
                    </p>
                  </div>
                  <Input
                    id="transcript-file"
                    type="file"
                    accept=".srt,.vtt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {uploadedFile && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-700 font-medium">
                      Selected: {uploadedFile.name}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={processTranscript}
            disabled={isProcessing || (!transcriptUrl && !uploadedFile)}
            className="w-full mt-4"
          >
            {isProcessing ? "Processing..." : "Analyze Call"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Call Analysis Summary</CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Duration: {analysisResult.metadata.duration}</span>
                <span>
                  Speakers: {analysisResult.metadata.speakers.join(", ")}
                </span>
                <span>
                  Analyzed Chunks: {analysisResult.metadata.totalChunks}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {analysisResult.summary}
              </p>
            </CardContent>
          </Card>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisResult.insights.map((insight, index) => (
              <Card
                key={index}
                className={`${getInsightColor(insight.type)} border-2`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <Badge variant="secondary" className="text-xs">
                        {insight.type.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/50 p-3 rounded-lg border">
                    <p className="text-sm italic">
                      &ldquo;{insight.quote}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Coaching Tip:</h4>
                    <p className="text-sm text-muted-foreground">
                      {insight.tip}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openFirefliesLink(insight.timestamp)}
                    className="w-full gap-2"
                  >
                    <Play className="h-3 w-3" />
                    Jump to {insight.timestamp}
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Example Notice */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Example Implementation
              </h3>
              <p className="text-sm text-blue-700">
                This is a demonstration of the Supavec + LLM workflow. In
                production, this would connect to the Fireflies API, embed
                transcript chunks via Supavec&apos;s /embed endpoint, and query
                for insights using the /query endpoint with customizable
                coaching prompts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
