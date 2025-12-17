import { TrimJob } from "@repo/shared";
import { trimVideo } from "@repo/ffmpeg";

export async function handleTrim(job: TrimJob) {
  await trimVideo(
    job.inputPath,
    job.outputPath,
    job.startTime,
    job.duration
  );
}
