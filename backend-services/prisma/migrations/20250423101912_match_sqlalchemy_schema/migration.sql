-- AlterTable: job_embeddings
ALTER TABLE "job_embeddings"
  DROP CONSTRAINT IF EXISTS "job_embeddings_pkey",
  ALTER COLUMN "id" SET DATA TYPE TEXT,
  ADD CONSTRAINT "job_embeddings_pkey" PRIMARY KEY ("id");

-- AlterTable: job_listings
ALTER TABLE "job_listings"
  DROP CONSTRAINT IF EXISTS "job_listings_pkey" CASCADE,
  ALTER COLUMN "id" SET DATA TYPE TEXT,
  ADD CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id");

-- AlterTable: job_scrape
ALTER TABLE "job_scrape"
  DROP CONSTRAINT IF EXISTS "job_scrape_pkey" CASCADE,
  ALTER COLUMN "id" SET DATA TYPE TEXT,
  ADD CONSTRAINT "job_scrape_pkey" PRIMARY KEY ("id");

-- AlterTable: recommended_jobs_title
ALTER TABLE "recommended_jobs_title"
  DROP CONSTRAINT IF EXISTS "recommended_jobs_title_pkey",
  ALTER COLUMN "id" SET DATA TYPE TEXT,
  ADD CONSTRAINT "recommended_jobs_title_pkey" PRIMARY KEY ("id");

-- job_scrape
ALTER TABLE "job_scrape"
  ALTER COLUMN "id" SET DATA TYPE UUID USING id::UUID;

-- job_listings
ALTER TABLE "job_listings"
  ALTER COLUMN "id" SET DATA TYPE UUID USING id::UUID;

-- job_embeddings
ALTER TABLE "job_embeddings"
  ALTER COLUMN "id" SET DATA TYPE UUID USING id::UUID;

-- recommended_jobs_title
ALTER TABLE "recommended_jobs_title"
  ALTER COLUMN "id" SET DATA TYPE UUID USING id::UUID;
