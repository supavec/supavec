CREATE INDEX idx_documents_file_id ON public.documents USING btree (file_id) WHERE (deleted_at IS NULL);


