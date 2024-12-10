import { useEffect, useRef} from 'react';

interface VideoProps {
  blob: Blob,
  videoWidth: number,
  videoHeight: number
}

export const VideoPlayer = ({ blob, videoWidth, videoHeight }: VideoProps) => {
  const playbackVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playbackVideoRef.current && blob) {
      const blobUrl = URL.createObjectURL(blob);
      console.log("bloburl of videoplayer", blobUrl);
      playbackVideoRef.current.src = blobUrl;
    }
  }, [blob]);

  return <video controls id='playback' ref={playbackVideoRef} style={{ width: `${videoWidth}px`, height: `${videoHeight}px` }} />
}