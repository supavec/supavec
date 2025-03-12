-- Step 1: Add the file_id column
ALTER TABLE documents ADD COLUMN file_id UUID;

-- Step 2: Migrate existing data from metadata->>'file_id' to the new column
UPDATE documents 
SET file_id = (metadata->>'file_id')::UUID 
WHERE metadata->>'file_id' IS NOT NULL;

-- Step 3: Create an index on the new column
CREATE INDEX idx_documents_file_id_column ON documents(file_id);

-- Step 4: Add a foreign key constraint (optional)
-- ALTER TABLE documents ADD CONSTRAINT fk_documents_file_id 
--   FOREIGN KEY (file_id) REFERENCES files(file_id);

-- Note: The foreign key constraint is commented out because it requires
-- verification that all file_ids in documents exist in the files table.
-- Uncomment and run after verifying data integrity. 