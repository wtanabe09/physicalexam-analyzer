import { useEffect, useState } from "react";

interface MediaStreamOptions {
  width: number;
  height: number;
  frameRate: number;
}

export const useMediaStream = ({ width, height, frameRate }: MediaStreamOptions) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getMedia = async () => {
      try {
        console.log(width, height, frameRate);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: width, height: height, frameRate: frameRate},
          audio: false,
        });

        if (isMounted) {
          setStream(mediaStream);
        } else {
          // Clean up the stream if the component unmounted
          mediaStream.getTracks().forEach(track => track.stop());
        }
      } catch (error) {
        console.error("Failed to get media stream:", error);
      }
    };

    getMedia();

    return () => {
      isMounted = false;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [width, height]);

  return { stream };
};