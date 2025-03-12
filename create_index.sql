CREATE INDEX idx_documents_embedding_cosine ON documents USING hnsw (embedding vector_cosine_ops);
