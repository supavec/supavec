import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { unlink, writeFile } from "fs/promises";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    // Get the form data from the request
    const formData = await request.formData();
    const pdfFile = formData.get("pdf") as File;

    if (!pdfFile) {
      return Response.json({ error: "No PDF file provided" }, { status: 400 });
    }

    // Convert File to Buffer and save temporarily
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tempPath = `/tmp/${Date.now()}-${pdfFile.name}`;
    await writeFile(tempPath, buffer);

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${pdfFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, buffer);

    if (uploadError) {
      return Response.json({ error: uploadError.message }, { status: 500 });
    }

    // Load and process PDF with LangChain
    const loader = new PDFLoader(tempPath);
    const pages = await loader.load();

    // Clean up temp file
    await unlink(tempPath);

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(pages);

    // Create embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Process each chunk and store in Supabase
    const vectors = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await embeddings.embedQuery(chunk.pageContent);
        return {
          content: chunk.pageContent,
          embedding,
          pdf_path: uploadData.path,
          pdf_name: pdfFile.name,
          metadata: chunk.metadata,
        };
      }),
    );

    // Store vectors in Supabase
    const { error: vectorError } = await supabase
      .from("document_vectors")
      .insert(vectors);

    if (vectorError) {
      return Response.json({ error: vectorError.message }, { status: 500 });
    }

    return Response.json({
      message: "PDF processed successfully",
      fileName: uploadData.path,
      chunks: vectors.length,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return Response.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
