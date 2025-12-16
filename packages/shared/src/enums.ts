export enum JobStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export enum JobOperation {
  TRIM = "TRIM",
  RESIZE = "RESIZE",
  EXTRACT_AUDIO = "EXTRACT_AUDIO"
}
