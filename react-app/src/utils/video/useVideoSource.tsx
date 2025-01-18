import { useEffect, useState } from "react";
import { VideoSource } from "../../consts/types";

export const useVideoSource = (videoRef: React.RefObject<HTMLVideoElement>, source: VideoSource) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;

    const setVideoSource = async () => {
      if (source instanceof Blob) {
        const blobUrl = URL.createObjectURL(source);
        video.src = blobUrl;
      } else {
        video.srcObject = source;
      }

      try {
        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });
        await video.play();
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }

    setVideoSource();

    const updateCurrentTime = () => {
      setCurrentTime(video.currentTime);
    };
    
    video.addEventListener('timeupdate', updateCurrentTime);
    
    return () => {
      video.pause();
      video.src = '';
      video.srcObject = null;
      video.removeEventListener('timeupdate', updateCurrentTime);
      URL.revokeObjectURL(video.src);
    }
  }, [videoRef, source]);

  // シークバーの変更ハンドラ
  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  return { currentTime, handleSeekChange }
};