import { useState } from "react";
import { useRouter } from "next/navigation";
import { File, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Tables } from "@/types/supabase";

type FileListItemProps = {
  file: Tables<"files">;
  apiKey: string;
};

export function FileListItem({ file, apiKey }: FileListItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delete_file`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: apiKey,
          },
          body: JSON.stringify({
            file_id: fileId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete file: ${response.status}`
        );
      }

      toast.success("File deleted successfully");
      // Dispatch a custom event when file is deleted
      window.dispatchEvent(
        new CustomEvent("fileDeleted", { detail: { fileId } })
      );
      router.refresh();
    } catch (error) {
      toast.error(
        `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="flex items-center justify-between bg-muted p-3 rounded-md">
      <div className="flex items-center space-x-3 w-full">
        <File className="h-5 w-5 text-blue-500" />
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <p className="font-medium">{file.file_name}</p>
            <code className="bg-background/50 px-2 py-1 rounded text-sm select-all w-fit">
              {file.file_id}
            </code>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(file.file_id!, file.file_name!)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="size-5 text-muted-foreground animate-spin" />
            ) : (
              <Trash2 className="size-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
