import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config from "@/lib/config";

// if (!process.env.DATABASE_URL) {
//     throw new Error("DATABASE_URL is not defined in environment variables");
//   }

const sql = neon(config.env.databaseUrl);
export const db = drizzle({ client: sql,  casing: "snake_case"});



