import {
  VideoJob,
  JobOperation
} from "@repo/shared";
import { handleTrim } from "./operations/trim";
import { handleResize } from "./operations/resize";
import { handleExtractAudio } from "./operations/extractAudio";

export async function dispatchJob(job: VideoJob) {
  switch (job.operation) {
    case JobOperation.TRIM:
      return handleTrim(job);

    case JobOperation.RESIZE:
      return handleResize(job);

    case JobOperation.EXTRACT_AUDIO:
      return handleExtractAudio(job);

    default:
      throw new Error("Unsupported operation");
  }
}
