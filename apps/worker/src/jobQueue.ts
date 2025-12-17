import { VideoJob } from "@repo/shared";

const queue: VideoJob[] = [];
let isProcessing = false;

export function enqueue(job: VideoJob) {
    queue.push(job);
    processNext();
}

async function processNext() {
    if (isProcessing) return;
    const job = queue.shift();
    if (!job) return;

    isProcessing = true;

    try {
        await execute(job);
    } catch (error) {
        console.error("Error processing job:", error);
    } finally {
        isProcessing = false;
        processNext();
    }
}

// this will be injected later
let execute: (job: VideoJob) => Promise<void>;

export function registerExecutor(
    fn: (job: VideoJob) => Promise<void>
) {
    execute = fn;
}
