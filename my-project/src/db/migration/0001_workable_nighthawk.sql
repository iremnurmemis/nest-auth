ALTER TABLE "tokenstable" ALTER COLUMN "id" SET DEFAULT 'c802f210-6fd7-427d-bae6-7151cf8b8d91';--> statement-breakpoint
ALTER TABLE "tokenstable" ALTER COLUMN "token" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "tokenstable" ALTER COLUMN "token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tokenstable" ALTER COLUMN "expiryDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "usersTable" ALTER COLUMN "id" SET DEFAULT '0108273d-d885-45d4-9338-94ce712c21ca';