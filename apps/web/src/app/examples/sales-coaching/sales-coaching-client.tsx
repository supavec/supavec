"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
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
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import type { AnalysisResult, InsightItem } from "@/types/sales-coaching";

export default function SalesCoachingClient() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) {
      return;
    }

    const file = event.target.files?.[0];
    if (file && (file.name.endsWith(".srt") || file.name.endsWith(".vtt"))) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    } else {
      toast.error("Please upload a valid .srt or .vtt file");
    }
  };

  const processTranscript = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a transcript file");
      return;
    }

    setIsProcessing(true);

    try {
      // Read file content
      const fileContent = await uploadedFile.text();

      // Call the real API endpoint
      const response = await fetch("/api/examples/sales-coaching/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: fileContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze transcript");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);

      // Reset form state after successful analysis
      setUploadedFile(null);
      const fileInput = document.getElementById(
        "transcript-file"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process transcript. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getInsightIcon = (type: InsightItem["type"]) => {
    switch (type) {
      case "win":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "risk":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "action":
        return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightColor = (type: InsightItem["type"]) => {
    switch (type) {
      case "win":
        return "bg-green-50 border-green-200";
      case "risk":
        return "bg-orange-50 border-orange-200";
      case "action":
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <>
      {/* Input Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Transcript
          </CardTitle>
          <CardDescription>
            Upload an .srt or .vtt transcript file to analyze.{" "}
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
          <div className="space-y-2">
            <Label htmlFor="transcript-file">Upload Transcript File</Label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 h-32 flex items-center justify-center transition-colors",
                isProcessing
                  ? "border-muted-foreground/10 bg-muted/5 cursor-not-allowed"
                  : "border-muted-foreground/25 bg-muted/10 hover:bg-muted/20 cursor-pointer"
              )}
            >
              <div className="text-center space-y-2">
                <Upload
                  className={cn(
                    "size-8 mx-auto",
                    isProcessing
                      ? "text-muted-foreground/30"
                      : "text-muted-foreground"
                  )}
                />
                <div className="text-sm text-muted-foreground">
                  <label
                    htmlFor="transcript-file"
                    className={cn(
                      "font-medium",
                      isProcessing
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-primary hover:text-primary/80 cursor-pointer"
                    )}
                  >
                    {isProcessing ? "Processing..." : "Choose a file"}
                  </label>{" "}
                  {!isProcessing && "or drag and drop"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isProcessing
                    ? "Please wait while analyzing"
                    : "SRT, VTT files only"}
                </p>
              </div>
              <Input
                id="transcript-file"
                type="file"
                accept=".srt,.vtt"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
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

          <Button
            onClick={processTranscript}
            disabled={isProcessing || !uploadedFile}
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
                <span>
                  Total Insights: {analysisResult.summary.total_insights}
                </span>
                <span>Wins: {analysisResult.summary.wins}</span>
                <span>Risks: {analysisResult.summary.risks}</span>
                <span>Actions: {analysisResult.summary.actions}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                Analysis completed successfully. Found{" "}
                {analysisResult.summary.total_insights} actionable insights to
                help improve sales performance.
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
                  </div>
                  <CardTitle className="text-lg">{insight.insight}</CardTitle>
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
                      {insight.coaching_tip}
                    </p>
                  </div>
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
    </>
  );
}
