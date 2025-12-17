import { extractAudio } from "@repo/ffmpeg";
import { ExtractAudioJob } from "@repo/shared"; 

export async function handleExtractAudio(job: ExtractAudioJob) {
  await extractAudio(
    job.inputPath, 
    job.outputPath
  );
}
