set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding vector, match_count integer DEFAULT NULL::integer, filter jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(id bigint, content text, metadata jsonb, embedding jsonb, similarity double precision)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where
    deleted_at is null
    and case 
      when filter->>'file_id' is not null and (filter->'file_id'->>'in') is not null then
        -- Use the dedicated file_id column instead of metadata->>'file_id'
        file_id = ANY(ARRAY(SELECT jsonb_array_elements_text(filter->'file_id'->'in')::uuid))
      else
        metadata @> filter
    end
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$function$
;


