import express from "express";
import { checkFFmpeg } from "./ffmpegCheck";
import { VideoJob, JobStatus, JobOperation } from "@repo/shared";
import { trimVideo } from "@repo/ffmpeg";

checkFFmpeg();

const app = express();
app.use(express.json());

app.post("/execute", async (req, res) => {
  const job: VideoJob = req.body;

  console.log("Received job:", job.id);

  job.status = JobStatus.PROCESSING;
  job.updatedAt = Date.now();

  console.log("Executing job:", job.id);

  try {
    job.status = JobStatus.PROCESSING;
    job.updatedAt = Date.now();

    switch (job.operation) {
      case JobOperation.TRIM:
        await trimVideo(
          job.inputPath,
          job.outputPath,
          job.startTime,
          job.duration
        );
        break;

      default:
        throw new Error("Unsupported operation");
    }
  } catch (error) {
    job.status = JobStatus.FAILED;
    job.updatedAt = Date.now(); 
  }

  job.status = JobStatus.COMPLETED;
  job.updatedAt = Date.now();

  res.json(job);
});

app.listen(4000, () => {
  console.log("Worker running on http://localhost:4000");
});
