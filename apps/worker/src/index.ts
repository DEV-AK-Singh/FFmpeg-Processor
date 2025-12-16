import express from "express";
import { checkFFmpeg } from "./ffmpegCheck";
import { VideoJob, JobStatus } from "@repo/shared";

checkFFmpeg();

const app = express();
app.use(express.json());

app.post("/execute", async (req, res) => {
  const job: VideoJob = req.body;

  console.log("Received job:", job.id);

  job.status = JobStatus.PROCESSING;
  job.updatedAt = Date.now();

  // FFmpeg execution will come next phase
  await new Promise((resolve) => setTimeout(resolve, 10000));

  job.status = JobStatus.COMPLETED;
  job.updatedAt = Date.now();

  res.json(job);
});

app.listen(4000, () => {
  console.log("Worker running on http://localhost:4000");
});
