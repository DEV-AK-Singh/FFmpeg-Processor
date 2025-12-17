import { redis, VideoJob } from "@repo/shared";
import { dispatchJob } from "./dispatcher";
import { JobStatus } from "@repo/shared";

const API_URL = "http://localhost:3000";

export async function startConsumer() {
    console.log("Worker waiting for jobs...");

    while (true) {
        const result = await redis.brpop("video_jobs", 0);
        if (!result) {
            console.log("No jobs to process...");
            continue;
        };

        const job: VideoJob = JSON.parse(result[1]);
        console.log("Received job:", job.id);

        try {
            job.status = JobStatus.PROCESSING;
            job.updatedAt = Date.now();
            console.log("Processing job:", job.id);

            await fetch(`${API_URL}/internal/jobs/${job.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(job)
            });

            await dispatchJob(job);

            job.status = JobStatus.COMPLETED;
            console.log("Completed job:", job.id);
        } catch {
            job.status = JobStatus.FAILED;
            console.error("Error processing job:", job.id);
        }

        job.updatedAt = Date.now();

        await fetch(`${API_URL}/internal/jobs/${job.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job)
        });
    }
}
