"use client";

import { useEffect, useRef, useState } from "react";
import {
  getCameraStream,
  attachStreamToVideo,
  startVideoPlayback,
  getMirrorClass,
  getCameraErrorMessage,
  type CameraOptions,
} from "@/ar-engine/utils/camera";
import type { CameraError } from "@/ar-engine/types";

export interface CameraFeedProps {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
  onReady?: (video: HTMLVideoElement) => void;
  onError?: (error: CameraError) => void;
  className?: string;
}

export function CameraFeed({
  facingMode = "user",
  width = 1280,
  height = 720,
  onReady,
  onError,
  className = "",
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CameraError | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      if (!videoRef.current) return;

      try {
        setLoading(true);
        setError(null);

        const options: CameraOptions = { facingMode, width, height };
        const { stream, stop } = await getCameraStream(options);

        if (!mounted) {
          stop();
          return;
        }

        streamRef.current = stream;
        attachStreamToVideo(stream, videoRef.current);
        await startVideoPlayback(videoRef.current);

        setLoading(false);

        if (onReady && videoRef.current) {
          onReady(videoRef.current);
        }
      } catch (err) {
        if (!mounted) return;

        const cameraError = err as CameraError;
        setError(cameraError);
        setLoading(false);

        if (onError) {
          onError(cameraError);
        }
      }
    }

    initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [facingMode, width, height, onReady, onError]);

  const mirrorClass = getMirrorClass(facingMode);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${mirrorClass}`}
        autoPlay
        playsInline
        muted
      />

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Starting camera...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center text-white max-w-md px-6">
            <div className="text-5xl mb-4">📷</div>
            <h3 className="text-xl font-semibold mb-2">Camera Error</h3>
            <p className="text-sm text-gray-300">
              {getCameraErrorMessage(error)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
