import { describe, it, expect } from 'vitest';
import { resolveDatabaseUrl } from '../server/lib/database-url';
const details = { SUPABASE_URL: 'https://tofmglzhxvdozgnwmvhb.supabase.co', SUPABASE_DB_POOLER_HOST: 'aws-0-ap-southeast-1.pooler.supabase.com' };
describe('Supabase database configuration', () => {
  it('preserves existing complete URIs and local defaults', () => {
    const uri = 'postgresql://postgres:encoded%40password@example.test:5432/postgres';
    expect(resolveDatabaseUrl({ DATABASE_URL: uri })).toBe(uri);
    expect(resolveDatabaseUrl({})).toBe('sqlite:memory');
  });
  it('encodes a password exactly once and uses the explicit shared transaction pooler', () => {
    const password = 'example@:/?#%[]& +';
    const uri = new URL(resolveDatabaseUrl({ ...details, DATABASE_URL: password }));
    expect(decodeURIComponent(uri.password)).toBe(password);
    expect(uri.username).toBe('postgres.tofmglzhxvdozgnwmvhb');
    expect(uri.hostname).toBe(details.SUPABASE_DB_POOLER_HOST);
    expect(uri.port).toBe('6543');
  });
  it('never sends a password to an unrecognized destination or exposes it in errors', () => {
    for (const config of [{}, { ...details, SUPABASE_DB_POOLER_HOST: 'attacker.test' }, { ...details, SUPABASE_URL: 'https://attacker.test' }]) {
      const run = () => resolveDatabaseUrl({ ...config, DATABASE_URL: 'private-example-password' });
      expect(run).toThrow('Database connection requires');
      try { run(); } catch (error) { expect(String(error)).not.toContain('private-example-password'); }
    }
  });
});
