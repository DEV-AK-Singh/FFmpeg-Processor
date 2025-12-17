import express from "express";
import { checkFFmpeg } from "./ffmpegCheck";
import { VideoJob, JobStatus, JobOperation } from "@repo/shared";
import { dispatchJob } from "./dispatcher";

checkFFmpeg();

const app = express();
app.use(express.json());

const API_URL = "http://localhost:3000";

const args = process.argv.slice(2);
const delayArg = args.find(arg => arg.startsWith('--delay='));

app.post("/execute", async (req, res) => {
  const job: VideoJob = req.body;

  console.log("Received job:", job.id);

  try {
    job.status = JobStatus.PROCESSING;
    job.updatedAt = Date.now();

    await fetch(`${API_URL}/internal/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job)
    });

    console.log("Executing job:", job.id);

    if (delayArg) {
      const delay = parseInt(delayArg.split('=')[1]);
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }

    await dispatchJob(job);

    job.status = JobStatus.COMPLETED;
    job.updatedAt = Date.now();
  } catch (error) {
    job.status = JobStatus.FAILED;
    job.updatedAt = Date.now();
  }

  await fetch(`${API_URL}/internal/jobs/${job.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });

  res.json(job);
});

app.listen(4000, () => {
  console.log("Worker running on http://localhost:4000");
});
