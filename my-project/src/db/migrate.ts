import {Pool} from "pg";
import "dotenv/config";
import {drizzle} from "drizzle-orm/node-postgres";
import {migrate} from "drizzle-orm/node-postgres/migrator";
import * as schema from "./schema";

const pool=new Pool({
    connectionString:process.env.DATABASE_URL,
    
});

const db=drizzle(pool,{schema});

async function main(){
    console.log("migration started..");
    await migrate(db,{migrationsFolder:"./apps/my-project/src/db/migration"});
    console.log("end migration");
    process.exit(0);

}

main().catch((err)=>{
    console.log(err);
    process.exit(0);
})