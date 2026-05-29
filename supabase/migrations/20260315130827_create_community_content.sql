create table if not exists community_content (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  content text not null,
  upvotes integer default 0
);
