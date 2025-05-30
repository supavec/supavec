export type SupavecUploadResponse = {
  success: boolean;
  message: string;
  file_id: string;
};

export type SupavecSearchResponse = {
  success: boolean;
  documents: Array<{
    content: string;
    file_id: string;
    score: string;
  }>;
};
