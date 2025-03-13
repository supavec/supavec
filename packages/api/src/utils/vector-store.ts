import type { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Stores documents directly in Supabase vector store with file_id
 * @param docs Array of Langchain documents to store
 * @param file_id UUID of the file these documents belong to
 * @param supabase Supabase client instance
 * @param batchSize Number of documents to process in each batch (default: 100)
 * @returns Object containing success status and count of inserted documents
 */
export async function storeDocumentsWithFileId(
  docs: Document[],
  file_id: string,
  supabase: SupabaseClient,
  batchSize = 100,
): Promise<{ success: boolean; insertedCount: number }> {
  console.log("[VECTOR-STORE] Storing documents with file_id", {
    documentCount: docs.length,
    file_id,
    batchSize,
  });

  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small",
    model: "text-embedding-3-small",
  });

  // Process documents in batches to avoid overwhelming the database
  const batches = [];
  for (let i = 0; i < docs.length; i += batchSize) {
    batches.push(docs.slice(i, i + batchSize));
  }

  console.log(
    `[VECTOR-STORE] Processing ${batches.length} batches of documents`,
  );

  let insertedCount = 0;
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(
      `[VECTOR-STORE] Processing batch ${
        i + 1
      }/${batches.length} with ${batch.length} documents`,
    );

    try {
      // Get embeddings for the current batch
      const texts = batch.map((doc) => doc.pageContent);
      const embeddingResults = await embeddings.embedDocuments(texts);

      const documentsToInsert = batch.map((doc, idx) => {
        return {
          content: doc.pageContent,
          metadata: doc.metadata,
          embedding: `[${embeddingResults[idx].join(",")}]`,
          file_id: file_id,
        };
      });

      const { error: insertError } = await supabase
        .from("documents")
        .insert(documentsToInsert);

      if (insertError) {
        console.error(
          `[VECTOR-STORE] Error inserting batch ${i + 1}:`,
          insertError,
        );
        throw new Error(`Failed to insert documents: ${insertError.message}`);
      }

      insertedCount += batch.length;
      console.log(
        `[VECTOR-STORE] Successfully inserted batch ${
          i + 1
        }/${batches.length}. Total inserted: ${insertedCount}/${docs.length}`,
      );
    } catch (error) {
      console.error(`[VECTOR-STORE] Error processing batch ${i + 1}:`, error);
      throw new Error(
        `Failed to process batch ${i + 1}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  console.log(
    `[VECTOR-STORE] All documents stored in vector store with file_id. Total inserted: ${insertedCount}`,
  );

  return { success: true, insertedCount };
}
