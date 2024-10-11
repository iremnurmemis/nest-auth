import {Pool} from "pg";
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema"

const pool=new Pool({
    connectionString:process.env.DATABASE_URL,
});

export const db=drizzle(pool,{schema});


