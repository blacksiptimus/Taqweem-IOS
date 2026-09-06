-- Run this in Supabase → SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  provider text,
  category text,
  amount numeric,
  billing_cycle text,
  renewal_date date,
  cancel_by_date date,
  notice_days int,
  early_termination_fee numeric,
  file_path text,
  raw_text text,
  notes text,
  created_at timestamptz default now()
);

create index if not exists contracts_user_id_idx on public.contracts (user_id);
create index if not exists contracts_cancel_by_date_idx on public.contracts (cancel_by_date);

alter table public.contracts enable row level security;

drop policy if exists "Users manage own contracts" on public.contracts;
create policy "Users manage own contracts"
on public.contracts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Private storage bucket for uploaded agreements
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

drop policy if exists "Users upload own contract files" on storage.objects;
create policy "Users upload own contract files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'contracts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users read own contract files" on storage.objects;
create policy "Users read own contract files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'contracts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users delete own contract files" on storage.objects;
create policy "Users delete own contract files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'contracts'
  and (storage.foldername(name))[1] = auth.uid()::text
);
