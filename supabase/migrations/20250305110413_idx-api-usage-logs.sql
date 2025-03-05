CREATE INDEX idx_api_usage_logs_user_id_created_at ON public.api_usage_logs USING btree (user_id, created_at);


