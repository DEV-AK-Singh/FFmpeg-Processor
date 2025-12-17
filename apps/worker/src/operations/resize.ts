import { ResizeJob } from "@repo/shared";
import { resizeVideo } from "@repo/ffmpeg";

export async function handleResize(job: ResizeJob) {
  await resizeVideo(
    job.inputPath, 
    job.outputPath, 
    job.width, 
    job.height
  );
}
