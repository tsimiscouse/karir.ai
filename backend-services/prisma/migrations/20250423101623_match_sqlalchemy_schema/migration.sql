/*
  Warnings:

  - The primary key for the `job_listings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `job_listings` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `job_listings` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `job_listings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `job_scrape` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sourceId` on the `job_scrape` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `job_scrape` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `recommended_jobs_title` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `jobTitleId` on the `recommended_jobs_title` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `recommended_jobs_title` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `userInputId` on the `recommended_jobs_title` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `resume` on the `users_input` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `jobListingId` to the `recommended_jobs_title` table without a default value. This is not possible if the table is not empty.
  - Added the required column `similarity_score` to the `recommended_jobs_title` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `analysis` on the `resume_analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "job_scrape" DROP CONSTRAINT "job_scrape_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "recommended_jobs_title" DROP CONSTRAINT "recommended_jobs_title_jobTitleId_fkey";

-- DropForeignKey
ALTER TABLE "recommended_jobs_title" DROP CONSTRAINT "recommended_jobs_title_userInputId_fkey";

-- DropForeignKey
ALTER TABLE "recommended_listing" DROP CONSTRAINT "recommended_listing_jobListingId_fkey";

-- AlterTable
ALTER TABLE "job_listings" DROP CONSTRAINT "job_listings_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "tags",
ADD COLUMN     "jobTags" TEXT,
ADD COLUMN     "logo" VARCHAR(255),
ADD COLUMN     "scrapeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "source_url" TEXT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "salaryMin" DROP NOT NULL,
ALTER COLUMN "salaryMin" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "salaryMax" DROP NOT NULL,
ALTER COLUMN "salaryMax" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "experience" DROP NOT NULL,
ADD CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "job_scrape" DROP CONSTRAINT "job_scrape_pkey",
DROP COLUMN "sourceId",
ADD COLUMN     "logo" VARCHAR(255),
ADD COLUMN     "source_url" TEXT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "salaryMin" DROP NOT NULL,
ALTER COLUMN "salaryMin" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "salaryMax" DROP NOT NULL,
ALTER COLUMN "salaryMax" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "experience" DROP NOT NULL,
ALTER COLUMN "jobTags" DROP NOT NULL,
ADD CONSTRAINT "job_scrape_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "recommended_jobs_title" DROP CONSTRAINT "recommended_jobs_title_pkey",
DROP COLUMN "jobTitleId",
ADD COLUMN     "jobListingId" VARCHAR(255) NOT NULL,
ADD COLUMN     "similarity_score" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "userInputId" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "recommended_jobs_title_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "resume_analysis" DROP COLUMN "analysis",
ADD COLUMN     "analysis" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "users_input" ALTER COLUMN "resume" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "job_embeddings" (
    "id" VARCHAR(255) NOT NULL,
    "job_id" VARCHAR(255) NOT NULL,
    "embedding" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_embeddings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recommended_jobs_title" ADD CONSTRAINT "recommended_jobs_title_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "users_input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommended_jobs_title" ADD CONSTRAINT "recommended_jobs_title_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_embeddings" ADD CONSTRAINT "job_embeddings_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_scrape"("id") ON DELETE CASCADE ON UPDATE CASCADE;
