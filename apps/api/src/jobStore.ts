import { VideoJob } from "@repo/shared";

const jobs = new Map<string, VideoJob>();

export const jobStore = {
    add(job: VideoJob) {
        jobs.set(job.id, job);
    },
    getAll() {
        return Array.from(jobs.values());
    },
    update(job: VideoJob) {
        jobs.set(job.id, job);
    },
    get(id: string) {
        console.log(id, jobs);
        return jobs.get(id);
    },
};