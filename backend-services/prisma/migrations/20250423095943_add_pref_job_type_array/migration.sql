/*
  Warnings:

  - You are about to drop the column `jobTitleId` on the `job_listings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "job_listings" DROP CONSTRAINT "job_listings_jobTitleId_fkey";

-- AlterTable
ALTER TABLE "job_listings" DROP COLUMN "jobTitleId";

-- AlterTable
ALTER TABLE "users_input" ADD COLUMN     "prefJobType" TEXT[];
