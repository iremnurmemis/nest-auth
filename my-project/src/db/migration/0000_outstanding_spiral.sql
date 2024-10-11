CREATE TABLE IF NOT EXISTS "tokenstable" (
	"id" uuid PRIMARY KEY DEFAULT 'cf78bea0-c05e-4576-b2ba-7a39134ac58b' NOT NULL,
	"token" varchar,
	"expiryDate" date,
	"userId" uuid NOT NULL,
	CONSTRAINT "tokenstable_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersTable" (
	"id" uuid PRIMARY KEY DEFAULT '97e3f932-6efd-46dc-ba3a-c72a525baaff' NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"firstname" varchar(100) NOT NULL,
	"lastname" varchar(100) NOT NULL,
	"picture" text,
	"googleAccessToken" text DEFAULT null,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "usersTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokenstable" ADD CONSTRAINT "tokenstable_userId_usersTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usersTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
