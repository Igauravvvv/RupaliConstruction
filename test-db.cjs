const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function test() {
  const connectionUrl = process.env.DATABASE_URL || "postgresql://postgres.jyprnabdmsplvlazwtvo:U3ElW6y6AW1Wx9SD@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const client = postgres(connectionUrl, { prepare: false, ssl: "require", connect_timeout: 10 });
  
  try {
    const result = await client`SELECT 1`;
    console.log("DB connected:", result);
    
    // Attempt to select from users
    const users = await client`SELECT * FROM users LIMIT 1`;
    console.log("Users:", users);

  } catch (err) {
    console.error("DB error:", err);
  } finally {
    await client.end();
  }
}

test();
