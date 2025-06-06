"use client";

import { useState } from "react";
import { Section } from "@/components/section";
import { motion } from "framer-motion";
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
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { AnalysisResult, InsightItem } from "@/types/sales-coaching";

const ease = [0.16, 1, 0.3, 1];

export function SalesCoachingInteractiveDemo() {
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
        "demo-transcript-file"
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
        return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800";
      case "risk":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800";
      case "action":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800";
    }
  };

  return (
    <Section
      id="interactive-demo"
      title="Try It Live"
      subtitle="Experience AI Coaching In Action"
      description="Upload your own transcript or use our sample to see instant coaching insights"
      align="center"
    >
      <div className="relative px-6 pb-6 lg:px-12 lg:pb-12 border-x">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Demo Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              <PlayCircle className="h-4 w-4" />
              Live Demo
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This is the actual Supavec engine in action. Upload a call
              transcript and watch as our AI generates actionable coaching
              insights in real-time.
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Your Call Transcript
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
                  to test the demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="demo-transcript-file">
                    Upload Transcript File
                  </Label>
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
                          htmlFor="demo-transcript-file"
                          className={cn(
                            "font-medium",
                            isProcessing
                              ? "text-muted-foreground/50 cursor-not-allowed"
                              : "text-primary hover:text-primary/80 cursor-pointer"
                          )}
                        >
                          {isProcessing
                            ? "Processing (may take ~20 seconds)..."
                            : "Choose a file"}
                        </label>{" "}
                        {!isProcessing && "or drag and drop"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isProcessing
                          ? "Please wait while analyzing transcript..."
                          : "SRT, VTT files only"}
                      </p>
                    </div>
                    <Input
                      id="demo-transcript-file"
                      type="file"
                      accept=".srt,.vtt"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Selected: {uploadedFile.name}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={processTranscript}
                    disabled={isProcessing || !uploadedFile}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing
                      ? "Processing (may take ~20 seconds)..."
                      : "Generate Coaching Brief"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Coaching Brief Generated
                  </CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Total Insights: {analysisResult.summary.total_insights}
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      Wins: {analysisResult.summary.wins}
                    </span>
                    <span className="text-orange-600 dark:text-orange-400">
                      Risks: {analysisResult.summary.risks}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Actions: {analysisResult.summary.actions}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    Analysis completed successfully! Found{" "}
                    {analysisResult.summary.total_insights} actionable insights
                    to help improve sales performance.
                  </p>
                </CardContent>
              </Card>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisResult.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.1,
                      ease,
                    }}
                    viewport={{ once: true }}
                  >
                    <Card
                      className={`${getInsightColor(insight.type)} border-2 h-full`}
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
                        <CardTitle className="text-lg">
                          {insight.insight}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white/70 dark:bg-gray-900/50 p-3 rounded-lg border">
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
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* How it works note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            viewport={{ once: true }}
          >
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Real Supavec Engine
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This demo uses the actual Supavec RAG engine. Your
                      transcript is chunked, embedded, and queried using our
                      open-source infrastructure—the same system you&apos;ll
                      deploy in production.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
