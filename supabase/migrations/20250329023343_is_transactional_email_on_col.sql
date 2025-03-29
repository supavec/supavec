alter table "public"."profiles" add column "is_transactional_email_on" boolean default true;

alter table "public"."profiles" alter column "email" set not null;


