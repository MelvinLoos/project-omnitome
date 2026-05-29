create table if not exists monsters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  cr text,
  type text,
  alignment text,
  raw_stats jsonb not null
);
