import { useCallback, useEffect, useState } from "react";
import { VideoSource } from "../../exports/types";

export const useVideoSource = (videoRef: React.RefObject<HTMLVideoElement> | null, source: VideoSource | null) => {
  const [videoCurrentTime, setCurrentTime] = useState<number>(0);

  const video = videoRef?.current

  const togglePlayPause = useCallback(() => {
    const video = videoRef?.current;
    if (!video || !source) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
    
  }, [source]);

  const toggleLooping = () => {
    if (!video) return;
    video.loop = !video.loop;
  };

  // シークバーの変更ハンドラ
  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (video) {
      video.currentTime = newTime;
    }
  };

  useEffect(() => {
    if (!video || !source) return;
    
    let objectUrl:string;
    try {
      if (source instanceof Blob) {
        objectUrl = URL.createObjectURL(source);;
        video.src = objectUrl
      } else if (source instanceof MediaStream) {
        video.srcObject = source;
      } else {
        console.error("Invalid video source type:", source);
      }

      // video.autoplay = true;
      // video.playsInline = true;
      video.muted = true;
      video.play().catch(console.error);

    } catch (error) {
      console.error("Error playing video:", error);
    }

    let animationFrameId: number;

    const updateCurrentTime = () => {
      setCurrentTime(video.currentTime);
      // animationFrameId = requestAnimationFrame(updateCurrentTime);
    };
    // video.addEventListener("timeupdate", updateCurrentTime);

    // animationFrameId = requestAnimationFrame(updateCurrentTime);
    
    // video.addEventListener('timeupdate', updateCurrentTime);
    video.ontimeupdate = updateCurrentTime
    
    return () => {
      if (video) {
        // video.pause();
        URL.revokeObjectURL(objectUrl);
        // cancelAnimationFrame(animationFrameId);
        // video.removeEventListener("timeupdate", updateCurrentTime);
      }
    }
  }, [video, source]);

  return { 
    videoCurrentTime, handleSeekChange, togglePlayPause, toggleLooping,
  }
};