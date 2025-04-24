/*
  Warnings:

  - The primary key for the `job_embeddings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `job_listings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `job_scrape` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `recommended_jobs_title` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `users_input` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_embeddings" DROP CONSTRAINT "job_embeddings_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "job_embeddings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "job_listings" DROP CONSTRAINT "job_listings_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "job_scrape" DROP CONSTRAINT "job_scrape_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "job_scrape_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recommended_jobs_title" DROP CONSTRAINT "recommended_jobs_title_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "recommended_jobs_title_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users_input" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "recommended_jobs_title" ADD CONSTRAINT "recommended_jobs_title_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_embeddings" ADD CONSTRAINT "job_embeddings_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;
