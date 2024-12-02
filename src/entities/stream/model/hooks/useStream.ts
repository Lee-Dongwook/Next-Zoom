"use client";

import { useEffect, useState } from "react";

export const useStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media device", error);
      }
    };

    getMediaStream();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stream;
};
