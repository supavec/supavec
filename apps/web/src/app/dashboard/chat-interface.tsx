"use client";

import type { Tables } from "@/types/supabase";
import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Code, MessageCircle, ArrowUpIcon, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useScrollToBottom } from "./use-scroll-to-bottom";

type SearchResult = {
  success: boolean;
  documents: {
    content: string;
  }[];
};

export function ChatInterface({
  uploadedFiles,
  apiKey,
}: {
  uploadedFiles: Tables<"files">[] | null;
  apiKey: string;
}) {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [embeddingFromAPI, setEmbeddingFromAPI] = useState<
    SearchResult["documents"] | null
  >(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const { messages, setMessages, handleSubmit, input, setInput, isLoading } =
    useChat({
      api: "/api/protected/chat",
      body: {
        apiKey,
        selectedFile,
      },
      initialMessages: [],
      onError: (error) => {
        toast.error(`An error occurred: ${error.message}`);
      },
    });

  // Add event listener for file deletion
  useEffect(() => {
    const handleFileDeleted = (event: CustomEvent<{ fileId: string }>) => {
      if (event.detail.fileId === selectedFile) {
        setSelectedFile("");
        setMessages([]);
        setEmbeddingFromAPI(null);
      }
    };

    window.addEventListener("fileDeleted", handleFileDeleted as EventListener);
    return () => {
      window.removeEventListener(
        "fileDeleted",
        handleFileDeleted as EventListener
      );
    };
  }, [selectedFile, setMessages]);

  const fetchSearchResults = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        query: input,
        file_ids: [selectedFile],
        include_embeddings: true,
      }),
    });

    if (!response.ok) {
      toast.error("Failed to search documents");
      return;
    }

    const data = (await response.json()) as SearchResult;
    setEmbeddingFromAPI(data.documents);
  };

  const handleFileSelect = (file: string) => {
    setSelectedFile(file);
    setMessages([]);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 relative">
      {(!uploadedFiles || uploadedFiles.length === 0) && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full p-4 md:p-8">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-4">
              <MessageCircle className="size-8 text-muted-foreground mb-2" />
              <p className="text-lg font-medium text-muted-foreground">
                Chat Interface
              </p>
              <p className="text-sm text-muted-foreground/80 text-center mt-1">
                Upload files to start chatting with them using AI
              </p>
            </div>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-4">
              <Code className="size-8 text-muted-foreground mb-2" />
              <p className="text-lg font-medium text-muted-foreground">
                Embedding Viewer
              </p>
              <p className="text-sm text-muted-foreground/80 text-center mt-1">
                See relevant document snippets as you chat
              </p>
            </div>
          </div>
        </div>
      )}
      <Card className="col-span-2 md:col-span-1 h-[600px] flex flex-col bg-background">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="size-5" />
            Chat with your files
          </h2>
          <Select onValueChange={handleFileSelect} value={selectedFile}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose a file" />
            </SelectTrigger>
            <SelectContent>
              {uploadedFiles?.map((file) => (
                <SelectItem key={file.id} value={file.file_id!}>
                  {file.file_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div
          className="flex-1 p-4 h-full w-full rounded-[inherit] overflow-auto"
          ref={messagesContainerRef}
        >
          {!selectedFile && (
            <div className="text-center text-muted-foreground p-4">
              Please select a file to start chatting ↑
            </div>
          )}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await Promise.all([handleSubmit(), fetchSearchResults()]);
          }}
          className="p-4 border-t"
        >
          <div className="flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your file..."
            />
            <Button
              type="submit"
              disabled={isLoading || !selectedFile || !input.trim()}
              className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <ArrowUpIcon size={14} />
              )}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="col-span-2 md:col-span-1 h-[600px] overflow-auto flex flex-col bg-background">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Code className="size-5" />
            Embedding data from API
          </h2>
        </div>
        <div className="flex-1">
          <ScrollArea className="flex-1" scrollHideDelay={0}>
            <div className="p-4">
              {embeddingFromAPI ? (
                <div className="font-mono text-sm bg-muted p-4 rounded-lg">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <pre className="whitespace-pre">
                      {JSON.stringify(embeddingFromAPI, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  Response from Supavec embeddings API will be shown here.
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
