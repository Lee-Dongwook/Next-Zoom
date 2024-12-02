"use client";

import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  stream: MediaStream | null;
  isLocal?: boolean;
};

export const VideoPlayer = ({ stream, isLocal }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocal}
      className="border rounded-md w-full h-64"
    />
  );
};
