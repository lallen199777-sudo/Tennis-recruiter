-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste this → Run)

create table if not exists board_data (
  user_id uuid references auth.users not null,
  key text not null,
  value text not null,
  updated_at timestamp with time zone default now(),
  primary key (user_id, key)
);

alter table board_data enable row level security;

-- Each user can only ever see, insert, or update their own rows.
create policy "Users can view their own data"
  on board_data for select
  using (auth.uid() = user_id);

create policy "Users can insert their own data"
  on board_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own data"
  on board_data for update
  using (auth.uid() = user_id);
