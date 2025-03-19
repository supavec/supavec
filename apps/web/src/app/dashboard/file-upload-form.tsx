"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { File, X, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function FileUploadForm({
  submitFile,
  placeholder = "Drag 'n' drop a PDF, text, or markdown file here (max 20MB), or click to select one",
  callBack,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitFile: (formData: FormData) => Promise<any>;
  placeholder?: string;
  callBack?: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFiles([]);
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await submitFile(formData);

      if (response.success === false) {
        throw new Error(response.error);
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to process file");
      }

      console.log("File processed successfully:", result);
      setFiles([]);
      router.refresh();
      callBack?.();

      toast.success("File processed successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-muted-foreground/25 hover:bg-muted rounded-lg p-6 cursor-pointer transition-colors bg-muted/50 flex flex-col items-center justify-center"
      >
        <input {...getInputProps()} />
        <div className="rounded-full bg-background p-3 shadow-sm">
          <ImagePlus className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-2 text-sm">
          {isDragActive ? "Drop the file here" : placeholder}
        </p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between p-2 rounded bg-muted/50">
            <div className="flex items-center">
              <File className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium">{files[0].name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing file...
              </>
            ) : (
              "Upload file"
            )}
          </Button>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
