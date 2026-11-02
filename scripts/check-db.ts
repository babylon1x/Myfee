// Step 1.1 connection test. Run with: npm run db:check
// Uses the app's own client (src/lib/db.ts). Never prints the connection string.
import { db } from "../src/lib/db.ts";

if (!process.env.DATABASE_URL) {
  console.error("FAILED: DATABASE_URL is not set. Add it to your .env file.");
  process.exit(1);
}

try {
  await db.$queryRaw`SELECT 1`;
  console.log("PASSED: connected to the database.");
} catch (error) {
  console.error("FAILED: could not connect to the database.");
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
