import express from "express";
import { checkFFmpeg } from "./ffmpegCheck";
import { VideoJob, JobStatus } from "@repo/shared";
import { enqueue, registerExecutor } from "./jobQueue";
import { dispatchJob } from "./dispatcher";

checkFFmpeg();

const app = express();
app.use(express.json());

const API_URL = "http://localhost:3000";

const args = process.argv.slice(2);
const delayArg = args.find(arg => arg.startsWith('--delay='));

registerExecutor(async (job) => {
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
    console.error("Error executing job:", job.id, error);

    job.status = JobStatus.FAILED;
    job.updatedAt = Date.now();
  }

  await fetch(`${API_URL}/internal/jobs/${job.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });
});


app.post("/execute", async (req, res) => {
  const job: VideoJob = req.body;

  console.log("Received job:", job.id);

  enqueue(job);

  res.status(202).json({
    message: "Job queued",
    jobId: job.id
  });
});

app.listen(4000, () => {
  console.log("Worker running on http://localhost:4000");
});
