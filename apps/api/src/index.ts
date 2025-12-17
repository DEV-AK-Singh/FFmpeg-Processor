import express from "express";
import { randomUUID } from "crypto";
import {
    JobOperation,
    JobStatus,
    QUEUE_NAME,
    redis,
    VideoJob
} from "@repo/shared";
import { jobStore } from "./jobStore.js";
import "dotenv/config";

const app = express();
app.use(express.json());

// const WORKER_URL = "http://localhost:4000";
const PORT = Number(process.env.API_PORT || 3000);

app.post("/jobs", async (req, res) => {
    const { operation, inputPath, outputPath, params } = req.body;

    const baseJob = {
        id: randomUUID(),
        inputPath,
        outputPath,
        operation,
        status: JobStatus.PENDING,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    let job: VideoJob;

    switch (operation) {
        case JobOperation.TRIM:
            job = {
                ...baseJob,
                operation,
                startTime: params.startTime,
                duration: params.duration
            };
            break;

        case JobOperation.RESIZE:
            job = {
                ...baseJob,
                operation,
                width: params.width,
                height: params.height
            };
            break;

        case JobOperation.EXTRACT_AUDIO:
            job = {
                ...baseJob,
                operation,
                format: params.format
            };
            break;

        default:
            return res.status(400).json({ error: "Invalid operation" });
    }

    jobStore.add(job); 
    
    // try {
    //     fetch(`${WORKER_URL}/execute`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(job)
    //     });
    // } catch (err) {
    //     console.error("Worker call failed", err);
    // }

    await redis.lpush(QUEUE_NAME, JSON.stringify(job));

    res.status(202).json({
        jobId: job.id,
        status: job.status
    });
});

app.get("/jobs/:id", (req, res) => {
    const job = jobStore.get(req.params.id);

    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
});

app.put("/internal/jobs/:id", (req, res) => {
    const job = req.body;
    jobStore.update(job);
    res.sendStatus(204);
});

app.get("/jobs", (_req, res) => {
    res.json(jobStore.getAll());
});

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
