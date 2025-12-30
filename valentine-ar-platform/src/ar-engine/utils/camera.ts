/**
 * Camera utilities for AR Engine
 */

import type { CameraError } from "../types";

export interface CameraOptions {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

export interface CameraStream {
  stream: MediaStream;
  stop: () => void;
}

/**
 * Check if camera is available
 */
export async function checkCameraAvailable(): Promise<boolean> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === "videoinput");
  } catch {
    return false;
  }
}

/**
 * Check camera permissions
 */
export async function checkCameraPermission(): Promise<
  "granted" | "denied" | "prompt" | "unsupported"
> {
  if (!navigator.permissions) {
    return "unsupported";
  }

  try {
    const result = await navigator.permissions.query({
      name: "camera" as PermissionName,
    });
    return result.state;
  } catch {
    return "unsupported";
  }
}

/**
 * Get camera stream with error handling
 */
export async function getCameraStream(
  options: CameraOptions = {}
): Promise<CameraStream> {
  const {
    facingMode = "user",
    width = 1280,
    height = 720,
  } = options;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw createCameraError("not_found", "Camera API not supported");
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        width: { ideal: width },
        height: { ideal: height },
      },
      audio: false,
    });

    const stop = () => {
      stream.getTracks().forEach((track) => track.stop());
    };

    return { stream, stop };
  } catch (error) {
    if (error instanceof Error) {
      throw parseCameraError(error);
    }
    throw createCameraError("unknown", "Failed to get camera stream");
  }
}

/**
 * Attach stream to video element
 */
export function attachStreamToVideo(
  stream: MediaStream,
  videoElement: HTMLVideoElement
): void {
  videoElement.srcObject = stream;
  videoElement.muted = true;
  videoElement.playsInline = true;
}

/**
 * Start video playback
 */
export async function startVideoPlayback(
  videoElement: HTMLVideoElement
): Promise<void> {
  try {
    await videoElement.play();
  } catch (error) {
    throw createCameraError("not_readable", "Failed to start video playback");
  }
}

/**
 * Stop camera stream
 */
export function stopCameraStream(stream: MediaStream): void {
  stream.getTracks().forEach((track) => track.stop());
}

/**
 * Get mirror CSS class for selfie mode
 */
export function getMirrorClass(facingMode: "user" | "environment"): string {
  return facingMode === "user" ? "scale-x-[-1]" : "";
}

/**
 * Parse camera error from native error
 */
function parseCameraError(error: Error): CameraError {
  const errorName = error.name.toLowerCase();

  if (errorName.includes("notallowed") || errorName.includes("permission")) {
    return createCameraError("permission_denied", "Camera permission denied");
  }

  if (errorName.includes("notfound") || errorName.includes("device")) {
    return createCameraError("not_found", "No camera device found");
  }

  if (errorName.includes("notreadable") || errorName.includes("track")) {
    return createCameraError("not_readable", "Camera is already in use");
  }

  if (errorName.includes("overconstrained")) {
    return createCameraError(
      "overconstrained",
      "Camera constraints not supported"
    );
  }

  return createCameraError("unknown", error.message || "Unknown camera error");
}

/**
 * Create camera error
 */
function createCameraError(
  type: CameraError["type"],
  message: string
): CameraError {
  return { type, message };
}

/**
 * Get user-friendly error message
 */
export function getCameraErrorMessage(error: CameraError): string {
  switch (error.type) {
    case "permission_denied":
      return "Camera access denied. Please allow camera permissions.";
    case "not_found":
      return "No camera found. Please connect a camera device.";
    case "not_readable":
      return "Camera is in use by another application.";
    case "overconstrained":
      return "Camera doesn't support required settings.";
    default:
      return "Failed to access camera. Please try again.";
  }
}
