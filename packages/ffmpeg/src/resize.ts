import { spawn } from "child_process";

export function resizeVideo(
  inputPath: string,
  outputPath: string, 
  width: number,
  height: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-i", inputPath,
      "-vf", `scale=${width}:${height}`,
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
