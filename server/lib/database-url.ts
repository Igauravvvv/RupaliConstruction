/** Allow the owner to supply a password separately from Supabase's public connection details. */
export function resolveDatabaseUrl(config: {
  DATABASE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_DB_POOLER_HOST?: string;
}) {
  const value = config.DATABASE_URL;
  if (!value) return "sqlite:memory";
  if (/^postgres(?:ql)?:\/\//.test(value) || value === "sqlite:memory") return value;

  // Password-only mode is opt-in through an explicitly configured Supabase pooler.
  const host = config.SUPABASE_DB_POOLER_HOST;
  let projectRef = "";
  try {
    const url = new URL(config.SUPABASE_URL || "");
    if (url.protocol === "https:" && /^[a-z0-9]{20}\.supabase\.co$/.test(url.hostname)) {
      projectRef = url.hostname.split(".")[0];
    }
  } catch { /* Report configuration errors without including credential values. */ }
  if (!projectRef || !host || !/^aws-[a-z0-9-]+\.pooler\.supabase\.com$/.test(host)) {
    throw new Error("Database connection requires a PostgreSQL URL, or a Supabase project URL and pooler host for password-only configuration.");
  }
  return `postgresql://postgres.${projectRef}:${encodeURIComponent(value)}@${host}:6543/postgres`;
}
