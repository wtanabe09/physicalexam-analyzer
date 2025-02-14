import { useCallback, useState } from "react";
import ReactPlayer from "react-player";

export const useVideoSource = (videoEle: HTMLVideoElement | null) => {
  const [videoCurrentTime, setCurrentTime] = useState<number>(0);

  const video = videoEle;

  const togglePlayPause = useCallback(() => {
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
    
  }, [video]);

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

  return { videoCurrentTime, handleSeekChange, togglePlayPause, toggleLooping }
};