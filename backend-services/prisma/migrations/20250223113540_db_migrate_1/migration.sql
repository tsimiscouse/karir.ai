-- CreateTable
CREATE TABLE "users_input" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "emailStatus" BOOLEAN NOT NULL,
    "paymentToken" VARCHAR(255),
    "paymentStatus" BOOLEAN NOT NULL,
    "resume" TEXT NOT NULL,
    "expectedSalary" INTEGER NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_analysis" (
    "id" TEXT NOT NULL,
    "userInputId" TEXT NOT NULL,
    "resumeScore" DOUBLE PRECISION NOT NULL,
    "analysis" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_titles" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,

    CONSTRAINT "job_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_listings" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "employmentType" VARCHAR(50) NOT NULL,
    "experience" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobTitleId" TEXT,

    CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommended_jobs_title" (
    "id" TEXT NOT NULL,
    "userInputId" TEXT NOT NULL,
    "jobTitleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommended_jobs_title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommended_listing" (
    "id" TEXT NOT NULL,
    "recommendedJobId" TEXT NOT NULL,
    "jobListingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommended_listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_scrape" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "employmentType" VARCHAR(50) NOT NULL,
    "experience" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jobTags" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "scrapeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_scrape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source" (
    "id" SERIAL NOT NULL,
    "sourceName" VARCHAR(255) NOT NULL,
    "sourceUrl" TEXT NOT NULL,

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resume_analysis" ADD CONSTRAINT "resume_analysis_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "users_input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "job_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommended_jobs_title" ADD CONSTRAINT "recommended_jobs_title_userInputId_fkey" FOREIGN KEY ("userInputId") REFERENCES "users_input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommended_jobs_title" ADD CONSTRAINT "recommended_jobs_title_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "job_titles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommended_listing" ADD CONSTRAINT "recommended_listing_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_scrape" ADD CONSTRAINT "job_scrape_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
