import postgres from 'postgres';

async function test() {
  const url = 'postgresql://postgres.jyprnabdmsplvlazwtvo:Rupali%400088@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';
  console.log('Connecting to:', url);
  try {
    const sql = postgres(url);
    const result = await sql`SELECT 1`;
    console.log('Success! Result:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error connecting:', err);
    process.exit(1);
  }
}

test();

test();
