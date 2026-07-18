import postgres from 'postgres';
import 'dotenv/config';

async function test() {
  console.log('Connecting to:', process.env.DATABASE_URL);
  try {
    const sql = postgres(process.env.DATABASE_URL as string);
    const result = await sql`SELECT 1`;
    console.log('Success! Result:', result);
    process.exit(0);
  } catch (err) {
    console.error('Error connecting:', err);
    process.exit(1);
  }
}

test();
