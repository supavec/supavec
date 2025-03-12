-- Vector similarity index (HNSW with cosine distance)
CREATE INDEX IF NOT EXISTS idx_documents_embedding_cosine ON documents USING hnsw (embedding vector_cosine_ops);

-- Index for filtering by file_id in metadata
CREATE INDEX IF NOT EXISTS idx_documents_file_id ON documents ((metadata->>'file_id'));

-- Optional: General GIN index for other metadata filtering
-- CREATE INDEX IF NOT EXISTS idx_documents_metadata ON documents USING GIN (metadata);

-- Note: Choose either the specific file_id index or the general GIN index based on your query patterns
-- If you primarily filter by file_id, the specific index is better
-- If you filter by various metadata fields, the GIN index might be more versatile 