# Vector Indexing for Improved Search Performance

This document provides instructions for adding vector indexes to the `documents` table to improve the performance of vector similarity searches.

## Background

With approximately 187,000 records in the `documents` table, vector searches are becoming slower. Adding appropriate indexes can significantly improve query performance.

## Understanding Our Search Pattern

Our search implementation:
1. Filters documents by `metadata->>'file_id'`
2. Performs vector similarity search on the filtered subset
3. Returns the top-k most similar documents

For optimal performance, we need indexes for both operations:
- A vector index for similarity search
- A B-tree index for metadata filtering

## Index Options

### Vector Similarity Indexes

#### 1. Basic HNSW Index (Recommended)

```sql
CREATE INDEX idx_documents_embedding_cosine ON documents USING hnsw (embedding vector_cosine_ops);
```

This creates a basic HNSW (Hierarchical Navigable Small World) index optimized for cosine similarity searches. HNSW is generally recommended because of its performance and robustness against changing data.

#### 2. Tuned HNSW Index

```sql
CREATE INDEX idx_documents_embedding_cosine_tuned ON documents USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
```

This creates an HNSW index with tuned parameters:
- `m`: Controls the maximum number of connections per node (higher values = better recall but slower construction)
- `ef_construction`: Controls the size of the dynamic candidate list during construction (higher values = better recall but slower construction)

#### 3. IVFFlat Index (Alternative)

```sql
CREATE INDEX idx_documents_embedding_ivfflat ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

IVFFlat is an alternative indexing method that partitions vectors into lists. It's generally faster to build but may provide less accurate results compared to HNSW.

### Metadata Filtering Indexes

#### 1. Specific Index for file_id (Recommended)

```sql
CREATE INDEX idx_documents_file_id ON documents ((metadata->>'file_id'));
```

This creates a B-tree index specifically for the `file_id` field within the metadata JSONB column. This is optimal if you primarily filter by `file_id`.

#### 2. General GIN Index for Metadata

```sql
CREATE INDEX idx_documents_metadata ON documents USING GIN (metadata);
```

This creates a GIN (Generalized Inverted Index) on the entire metadata column. This is useful if you filter by various fields within the metadata, not just `file_id`.

## Recommended Implementation

For our specific search pattern, we recommend implementing:

1. The HNSW vector index for similarity search
2. The specific B-tree index for file_id filtering

These two indexes together will provide the best performance for our current search implementation.

## How to Apply

To apply the indexes, connect to your Supabase database and execute the SQL commands in the `create_indexes.sql` file. This file contains all the recommended indexes.

**Note**: Creating indexes on a large table can be resource-intensive and may take some time to complete. Consider running this during off-peak hours.

## Monitoring Performance

After applying the indexes, monitor the performance of your `/search` API endpoint. You should see improved response times for vector similarity searches.

## Additional Considerations

1. **Index Size**: Vector indexes can be large. Monitor your database storage usage after creating the index.

2. **Index Maintenance**: The indexes will be automatically maintained as you add, update, or delete records.

3. **Query Performance**: If you're still experiencing performance issues after indexing, consider:
   - Limiting the number of files searched at once
   - Implementing pagination for search results
   - Splitting your vector data across multiple databases for very large collections

## References

- [Supabase Vector Indexes Documentation](https://supabase.com/docs/guides/ai/vector-indexes)
- [HNSW Indexes Documentation](https://supabase.com/docs/guides/ai/vector-indexes/hnsw-indexes)
- [Engineering for Scale](https://supabase.com/docs/guides/ai/engineering-for-scale)
- [PostgreSQL JSONB Indexing](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING) 