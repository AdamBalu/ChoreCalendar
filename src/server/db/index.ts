import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Create a Neon HTTP client for serverless PostgreSQL
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Drizzle ORM instance with schema
 */
export const db = drizzle(sql, { schema });
