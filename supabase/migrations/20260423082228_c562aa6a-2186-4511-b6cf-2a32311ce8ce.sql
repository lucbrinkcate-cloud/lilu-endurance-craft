
-- Status enum
create type public.kit_request_status as enum ('draft','pending','approved','rejected','ordered');

-- Kit requests table
create table public.kit_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status public.kit_request_status not null default 'pending',
  customer_email text not null,
  customer_name text not null,
  club_name text not null,
  estimated_qty int not null default 1,
  logo_url text not null,
  base_style text not null,
  primary_color text not null,
  secondary_color text,
  accent_color text,
  generated_designs jsonb not null default '[]'::jsonb,
  selected_design_index int,
  admin_notes text,
  approved_price_cents int,
  shopify_product_id text,
  shopify_product_url text
);

alter table public.kit_requests enable row level security;

-- Anyone can insert a request (public form submission)
create policy "anyone can submit kit requests"
on public.kit_requests for insert
to anon, authenticated
with check (true);

-- Anyone can read by id (status page is public; id is unguessable UUID).
create policy "anyone can read kit requests"
on public.kit_requests for select
to anon, authenticated
using (true);

-- No public updates/deletes — admin operations go through server functions using the service role key.

-- Storage buckets
insert into storage.buckets (id, name, public) values ('club-logos','club-logos', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('kit-mockups','kit-mockups', true)
  on conflict (id) do nothing;

-- Public read for both buckets
create policy "public read club-logos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'club-logos');

create policy "public read kit-mockups"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'kit-mockups');

-- Public uploads to club-logos (logos uploaded from designer form)
create policy "public upload club-logos"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'club-logos');
