New Supabase: tofmglzhxvdozgnwmvhb

Restored from public repository content:
- 9 application tables, with row-level security enabled and no anonymous access policies.
- 5 public project records and 8 published articles.
- 21 original local image files uploaded to the public images bucket; all public URLs checked successfully.
- Gold Gym's 7 images identified and linked. Remaining project-to-photo assignments are unconfirmed.

This is a public-content reconstruction, not a complete database backup.
No historical user accounts, password hashes, leads, enquiries, chats, or unpublished/admin-only changes were recoverable from these sources.
Original inaccessible media URLs are retained in original-project-media.json.
Unidentified images are preserved in storage but not falsely assigned to a project.

To generate additive SQL: node --import tsx scripts/prepare-supabase-recovery.mjs
new-supabase.sql can be rerun without overwriting existing project/article edits.
verify-media.sql updates only Gold Gym's gallery and checks recovery counts.

Vercel production supports DATABASE_URL as a complete transaction-pooler URI.
Alternatively, DATABASE_URL may contain only the database password when SUPABASE_URL
and SUPABASE_DB_POOLER_HOST are explicitly configured. The server URL-encodes it.
For migration scripts that read DATABASE_URL directly, use a complete URI.
Storage requires SUPABASE_URL, SUPABASE_BUCKET_NAME=images, and SUPABASE_SERVICE_ROLE_KEY saved as a Secret.
Never put credentials in this repository or browser/client build variables.
After saving environment changes, redeploy and verify project.list, blog.list, project detail pages, and authenticated uploads.
