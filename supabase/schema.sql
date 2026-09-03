create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  status text not null default 'wishlist'
    check (status in ('wishlist', 'applied', 'interview', 'offer', 'rejected')),
  job_url text,
  job_description text,
  notes text,
  applied_at date,
  created_at timestamptz not null default now()
);

-- Uso personal de un solo usuario: dejamos la tabla abierta con la anon key.
-- Si mas adelante agregas login, activa RLS de verdad con policies por user_id.
alter table applications enable row level security;

create policy "allow all for anon (uso personal)"
  on applications
  for all
  using (true)
  with check (true);
