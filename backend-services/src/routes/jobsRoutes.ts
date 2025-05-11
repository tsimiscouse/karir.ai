import express from "express";
import { dropAllJobsAndEmbeddings } from "../controllers/jobsController";

const router = express.Router();

router.delete("/jobs/drop-all", dropAllJobsAndEmbeddings);

export default router;
