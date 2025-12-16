import { JobOperation, JobStatus } from "./enums";

export interface BaseJob {
  id: string;
  inputPath: string;
  outputPath: string;
  status: JobStatus;
  operation: JobOperation;
  createdAt: number;
  updatedAt: number;
}

export interface TrimJob extends BaseJob {
  operation: JobOperation.TRIM;
  startTime: number;
  duration: number;
}

export interface ResizeJob extends BaseJob {
  operation: JobOperation.RESIZE;
  width: number;
  height: number;
}

export interface ExtractAudioJob extends BaseJob {
  operation: JobOperation.EXTRACT_AUDIO;
  format: "mp3" | "wav" | "ogg";
}

export type VideoJob =
  | TrimJob
  | ResizeJob
  | ExtractAudioJob;
