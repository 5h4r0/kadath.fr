create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ip_address text,
  turnstile_verified boolean default false,
  sent_at timestamptz default now(),
  read_at timestamptz
);

alter table contact_messages enable row level security;
-- No public select — admin only via service role
