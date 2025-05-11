import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dropAllJobsAndEmbeddings = async (req: Request, res: Response) => {
  try {
    // Delete all entries in job_scrape — job_embeddings will be deleted automatically due to cascade
    await prisma.jobScrape.deleteMany({});

    res.status(200).json({
      message: "all job data and embeddings have been deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({
      message: "there is an error deleting the data.",
      error,
    });
  }
};
