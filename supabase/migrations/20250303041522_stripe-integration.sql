alter table "public"."profiles" add column "last_usage_reset_at" timestamp with time zone;

alter table "public"."profiles" add column "stripe_customer_id" text;

alter table "public"."profiles" add column "stripe_interval" text;

alter table "public"."profiles" add column "stripe_is_subscribed" boolean not null default false;

alter table "public"."profiles" add column "stripe_subscribed_product_id" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  team_id uuid;  -- Declare a variable to hold the new team's ID
BEGIN
  -- Insert the new profile
  INSERT INTO public.profiles (id, email, name, last_usage_reset_at)
  VALUES (new.id, new.raw_user_meta_data ->> 'email', new.raw_user_meta_data ->> 'name', NOW());

  -- Insert a new team associated with the new user
  INSERT INTO public.teams (name)
  VALUES (new.raw_user_meta_data ->> 'name' || '''s team')  -- Format the team name correctly
  RETURNING id INTO team_id;  -- Capture the new team's ID

  -- Insert a new record in the team_memberships table
  INSERT INTO public.team_memberships (profile_id, team_id)
  VALUES (new.id, team_id);

  RETURN new;
END;
$function$
;


