
drop policy if exists "public read club-logos" on storage.objects;
drop policy if exists "public read kit-mockups" on storage.objects;
-- Public buckets serve files directly via CDN without needing a SELECT policy.
-- Removing the broad SELECT prevents unauthenticated bucket listing.
