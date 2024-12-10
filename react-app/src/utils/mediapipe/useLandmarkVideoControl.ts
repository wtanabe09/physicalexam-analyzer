import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoBlob: Blob;
}

export const useLandmarkVideoControl = ({
  videoRef, videoBlob
}: Props) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.paused) {
      playPromiseRef.current = video.play().catch(console.error);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [setIsPlaying, videoRef]);

  const toggleLooping = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.loop = !isLooping;
    setIsLooping(prev => !prev);
    setIsPlaying(false);
  }, [isLooping, setIsPlaying, videoRef]);

  const handleLoaded = useCallback(() => {
    if (!videoRef.current) return;
    if (!videoRef.current.paused) {
      setIsPlaying(true);
    }
  }, [setIsPlaying, videoRef]);

  const handleEnded = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    if (isLooping) {
      playPromiseRef.current = videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
    setIsPlaying(false);
  }, [isLooping, setIsPlaying, videoRef]);

  useEffect(() => {
    if (!videoRef.current || !videoBlob) return;

    const video = videoRef.current;
    const objectUrl = URL.createObjectURL(videoBlob);
    video.src = objectUrl;
    video.loop = isLooping;

    const cleanup = () => {
      video.pause();
      video.src = '';
      URL.revokeObjectURL(objectUrl);
      setIsPlaying(false);
    };

    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('ended', handleEnded);

    return () => {
      cleanup();
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoBlob, isLooping, handleLoaded, handleEnded, videoRef]);

  return {
    isPlaying,
    isLooping,
    togglePlayPause,
    toggleLooping,
  };
};