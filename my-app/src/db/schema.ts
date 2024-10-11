
import { pgTable, serial,varchar } from "drizzle-orm/pg-core";

export const userTable=pgTable("migrationdeneme",{
    id:serial('id').primaryKey(),
    name:varchar('name',{length:255})
})