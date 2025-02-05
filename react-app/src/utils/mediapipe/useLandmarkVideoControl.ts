import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoBlob: Blob;
}

export const useLandmarkVideoControl = ({ videoRef, videoBlob }: Props) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // const [isLooping, setIsLooping] = useState<boolean>(false);
  const isLoopingRef = useRef<boolean>(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current?.src || !videoBlob) return;
    const video = videoRef.current;
    if (video.paused) {
      playPromiseRef.current = video.play().catch(console.error);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [videoBlob, videoRef]);

  const toggleLooping = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.loop = !isLoopingRef.current;
    isLoopingRef.current = !isLoopingRef.current;
  }, [videoRef]);

  const handleLoaded = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      setIsPlaying(true);
    }
  }, [setIsPlaying, videoRef]);

  const handleEnded = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  }, [setIsPlaying, videoRef]);

  useEffect(() => {
    if (!videoRef.current || !videoBlob) return;

    const video = videoRef.current;
    const objectUrl = URL.createObjectURL(videoBlob);
    video.src = objectUrl;

    video.onloadeddata = handleLoaded;
    video.onended = handleEnded;

    const cleanup = () => {
      video.pause();
      video.src = '';
      URL.revokeObjectURL(objectUrl);
      setIsPlaying(false);
    };

    return () => {
      cleanup();
      video.onloadeddata = null
      video.onended = null
    };
  }, [videoBlob, handleLoaded, handleEnded, videoRef]);

  return {
    isPlaying, isLoopingRef, handleLoaded, handleEnded, togglePlayPause, toggleLooping,
  };
};