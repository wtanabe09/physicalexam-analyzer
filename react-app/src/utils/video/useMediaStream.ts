import { useEffect, useState } from "react";

interface MediaStreamOptions {
  width: number;
  height: number;
  frameRate: number;
}

export const useMediaStream = ({ width, height, frameRate }: MediaStreamOptions) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {

    const getMedia = async () => {
      try {
        navigator.mediaDevices.getUserMedia({
          video: { width: width, height: height, frameRate: frameRate},
          audio: false,
        }).then(mediaStream => setStream(mediaStream));
        console.log(`get user media: ${width}, ${height}, ${frameRate}`);

      } catch (error) {
        console.error("Failed to get media stream:", error);
      }
    };

    getMedia();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, frameRate]);

  return { stream };
};