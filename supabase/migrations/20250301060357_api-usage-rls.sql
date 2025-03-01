create policy "Enable select for users based on user_id"
on "public"."api_usage_logs"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));



