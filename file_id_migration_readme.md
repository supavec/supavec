# Migrating to a Dedicated file_id Column

This document explains the process and benefits of migrating from using `metadata->>'file_id'` to a dedicated `file_id` column in the `documents` table.

## Why Make This Change?

### Performance Benefits

1. **Faster Queries**: Direct column access is significantly faster than JSONB extraction operations
   - PostgreSQL can use more efficient access methods for native columns
   - Eliminates the overhead of parsing and extracting from JSONB

2. **Better Indexing**: 
   - B-tree indexes on regular columns are more compact and efficient
   - Improved query planning by PostgreSQL's optimizer

3. **Reduced Storage**: 
   - Storing the UUID once instead of duplicating it in the JSONB
   - More efficient storage format for UUIDs vs. text in JSONB

### Data Integrity Benefits

1. **Type Safety**: 
   - The column is explicitly typed as UUID
   - Prevents invalid values from being stored

2. **Constraints**: 
   - Can add NOT NULL constraints if appropriate
   - Can add foreign key constraints to ensure referential integrity with the `files` table

### Development Benefits

1. **Cleaner Code**: 
   - Simpler SQL queries without JSON operators
   - More readable and maintainable code

2. **Better Documentation**: 
   - Schema explicitly shows the relationship between documents and files
   - Self-documenting database design

## Migration Process

The migration involves four main steps:

1. **Add the new column**:
   ```sql
   ALTER TABLE documents ADD COLUMN file_id UUID;
   ```

2. **Migrate existing data**:
   ```sql
   UPDATE documents 
   SET file_id = (metadata->>'file_id')::UUID 
   WHERE metadata->>'file_id' IS NOT NULL;
   ```

3. **Create an index on the new column**:
   ```sql
   CREATE INDEX idx_documents_file_id_column ON documents(file_id);
   ```

4. **Update the `match_documents` function** to use the new column:
   ```sql
   -- See update_match_documents.sql for the full function
   ```

## Implementation Considerations

### Data Consistency

After migration, you have two sources of truth for the file_id:
1. The new `file_id` column
2. The existing `metadata->>'file_id'` value

You have several options:
- Keep both and ensure they stay in sync (more complex)
- Remove `file_id` from metadata (cleaner but requires code changes)
- Keep `file_id` in metadata for backward compatibility but treat the column as the source of truth

### Code Changes

The migration requires updates to:
1. The database schema
2. The `match_documents` function
3. Any code that directly accesses `metadata->>'file_id'`

### Performance Impact

- The migration process itself may be resource-intensive for large tables
- Consider running the migration during off-peak hours
- The performance benefits will be noticeable immediately after migration

## Conclusion

Migrating to a dedicated `file_id` column is a worthwhile investment that will improve query performance, especially for the `/search` API endpoint. The migration process is straightforward and the benefits will increase as your data grows. 