import { useEffect, useState } from "react";
import { VideoSource } from "../../exports/types";

export const useVideoSource = (video: HTMLVideoElement | null, source: VideoSource | null) => {
  const [videoCurrentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!video || !source) return;

    const setVideoSource = async () => {
      try {
        if (source instanceof Blob) {
          const blobUrl = URL.createObjectURL(source);
          video.src = blobUrl;
        } else {
          video.srcObject = source;
        }

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
  }, [video, source]);

  // シークバーの変更ハンドラ
  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (video) {
      video.currentTime = newTime;
    }
  };

  return { videoCurrentTime, handleSeekChange }
};