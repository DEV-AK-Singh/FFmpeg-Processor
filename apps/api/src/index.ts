import express from "express";
import { randomUUID } from "crypto";
import {
    JobOperation,
    JobStatus,
    VideoJob
} from "@repo/shared";
import { jobStore } from "./jobStore";

const app = express();
app.use(express.json());

app.post("/jobs", (req, res) => {
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
    res.status(201).json(job);
});

app.put("/jobs/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const job = jobStore.get(id);

    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }

    job.status = status;
    job.updatedAt = Date.now();

    jobStore.update(id, job);

    res.json(job);
});

app.get("/jobs", (_req, res) => {
    res.json(jobStore.getAll());
});

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});
