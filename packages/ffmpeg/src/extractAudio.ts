import { spawn } from "child_process";

export function extractAudio(
  inputPath: string,
  outputPath: string 
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i", inputPath,
      outputPath
    ];

    const ffmpeg = spawn("ffmpeg", args);

    ffmpeg.on("error", reject);

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}
