"use client";

import { useState, useEffect } from "react";
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
import {
  Upload,
  FileText,
  MessageSquare,
  CornerRightUp,
  File,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useChat } from "ai/react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostHog } from "posthog-js/react";
import { FileUploadForm } from "@/app/dashboard/file-upload-form";

export default function ChatWithPDFClient() {
  const posthog = usePostHog();
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedFileId = localStorage.getItem("pdfFileId_demo");
    const storedFileName = localStorage.getItem("pdfFileName_demo");

    if (storedFileId && storedFileName) {
      setFileId(storedFileId);
      setFileName(storedFileName);
    } else {
      // Clear any stale data
      localStorage.removeItem("pdfFileId_demo");
      localStorage.removeItem("pdfFileName_demo");
    }
  }, []);

  const { messages, isLoading, handleSubmit, input, setInput } = useChat({
    body: {
      fileId,
    },
    api: "/api/examples/chat-with-pdf",
    initialMessages: [],
    onResponse() {
      setChatStarted(true);
    },
    onFinish() {
      posthog.capture(
        "Chatting with PDF example completed",
        { query: input },
        { send_instantly: true }
      );
    },
  });

  const submitFile = async (formData: FormData) => {
    setIsUploading(true);

    try {
      const response = await fetch("/api/examples/upload-file", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload file");
      }

      localStorage.setItem("pdfFileId_demo", result.file_id);
      localStorage.setItem("pdfFileName_demo", result.file_name);

      setFileId(result.file_id);
      setFileName(result.file_name);

      posthog.capture(
        "Upload file in Chat with PDF example",
        {},
        { send_instantly: true }
      );

      toast.success("File uploaded successfully!");
      return { success: true };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload file. Please try again."
      );
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    localStorage.removeItem("pdfFileId_demo");
    localStorage.removeItem("pdfFileName_demo");
    setFileId(null);
    setFileName(null);
    setChatStarted(false);
    setInput("");
  };

  const submitChatForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !fileId) return;

    posthog.capture(
      "Chatting with PDF example",
      { query: input },
      { send_instantly: true }
    );

    handleSubmit();
  };

  return (
    <>
      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload PDF Document
          </CardTitle>
          <CardDescription>
            Upload a PDF file to start chatting with it. You can ask questions,
            get summaries, or extract specific information from your document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!fileName ? (
            <div className="space-y-2">
              <Label htmlFor="pdf-file">Upload PDF File</Label>
              <FileUploadForm
                placeholder="Drag 'n' drop a PDF file here (max 20MB), or click to select one"
                submitFile={submitFile}
                callBack={() => {
                  // File upload callback handled in submitFile
                }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FileText className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700 font-medium flex-1">
                  Uploaded: {fileName}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={removeFile}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Section */}
      {fileName && fileId && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat with Your PDF
            </CardTitle>
            <CardDescription>
              Ask questions about your document and get instant answers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitChatForm} className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="What do you want to ask about this document?"
                  value={input}
                  disabled={isLoading}
                  onChange={(e) => setInput(e.target.value)}
                  className="pr-12"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  <CornerRightUp className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Chat Messages */}
            {(messages.length > 0 || isLoading) && (
              <div className="mt-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg",
                      message.role === "user"
                        ? "bg-blue-50 border border-blue-200 ml-8"
                        : "bg-muted/50 mr-8"
                    )}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="p-4 rounded-lg bg-muted/50 mr-8">
                    <div className="text-sm font-medium mb-1">AI Assistant</div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Example Notice */}
      <Card className="bg-blue-50 border-blue-200">
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
                production, this would connect to your document storage, embed
                document chunks via Supavec&apos;s /embed endpoint, and query
                for relevant information using the /query endpoint with
                customizable chat prompts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
