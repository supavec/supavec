CREATE INDEX idx_documents_embedding_cosine_tuned ON documents USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
