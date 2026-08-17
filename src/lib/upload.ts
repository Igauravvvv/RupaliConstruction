/**
 * Shared image upload utility.
 *
 * On production (Supabase configured) the flow is:
 *   1. POST /api/upload/presign  → get a signed upload URL
 *   2. PUT file directly to Supabase Storage (bypasses Vercel 4.5 MB limit)
 *
 * On local development (no Supabase) the flow falls back to:
 *   1. POST /api/upload  → server writes to public/uploads/
 */

const UPLOAD_TIMEOUT_MS = 60_000; // 60 seconds

interface PresignResponse {
  /** Supabase signed upload URL (browser uploads directly here). */
  uploadUrl: string;
  /** Final public URL for the image after upload. */
  publicUrl: string;
  /** If true the server has no cloud storage — use the legacy direct upload. */
  useDirectUpload?: boolean;
}

/**
 * Upload a single image file and return its public URL.
 *
 * Works in both local development (direct upload) and production (presigned
 * Supabase upload that bypasses Vercel's 4.5 MB serverless body limit).
 */
export async function uploadImageFile(file: File): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    // ── Step 1: Ask the server for a presigned upload URL ──────────────
    // Keep the metadata in the query string. On Vercel this endpoint is
    // handled by Hono, and avoiding a request body prevents intermediary
    // body parsing from stalling the presign request before Hono receives it.
    const params = new URLSearchParams({
      contentType: file.type,
      fileSize: String(file.size),
    });
    const presignRes = await fetch(`/api/upload/presign?${params}`, {
      method: "POST",
      signal: controller.signal,
    });

    if (!presignRes.ok) {
      const errBody = await presignRes.json().catch(() => ({}));
      throw new Error(
        (errBody as any).error || `Presign failed (${presignRes.status})`
      );
    }

    const presignData: PresignResponse = await presignRes.json();

    // ── Step 2a: Cloud upload via presigned URL ───────────────────────
    if (!presignData.useDirectUpload && presignData.uploadUrl) {
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
        signal: controller.signal,
      });

      if (!uploadRes.ok) {
        const msg = await uploadRes.text().catch(() => "");
        throw new Error(`Storage upload failed (${uploadRes.status}): ${msg}`);
      }

      return presignData.publicUrl;
    }

    // ── Step 2b: Fallback — local dev direct upload ──────────────────
    return await directUpload(file, controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Legacy direct upload — sends the file as FormData to `/api/upload`.
 * Used only in local development where no cloud storage is configured.
 */
async function directUpload(file: File, signal: AbortSignal): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    signal,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(
      (errBody as any).error || `Upload failed (${res.status})`
    );
  }

  const data = await res.json();
  return data.url;
}
