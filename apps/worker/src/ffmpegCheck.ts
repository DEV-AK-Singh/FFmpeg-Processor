import { execSync } from "child_process";

export function checkFFmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    console.log("FFmpeg detected");
  } catch {
    console.error("FFmpeg not found in PATH");
    process.exit(1);
  }
}

checkFFmpeg();