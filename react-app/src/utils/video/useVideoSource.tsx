import { useEffect, useState } from "react";
import { VideoSource } from "../../exports/types";

export const useVideoSource = (video: HTMLVideoElement | null, source: VideoSource | null) => {
  const [videoCurrentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!video || !source) return;
    
    const setVideoSource = async () => {
      try {
        if (source instanceof Blob) {
          video.src = URL.createObjectURL(source);;
        } else {
          video.srcObject = source;
          // 録画機能はこれがないと動画のスタートがされない。
          video.play();
        }

        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;

      } catch (error) {
        console.error("Error playing video:", error);
      }
    }

    setVideoSource();

    const updateCurrentTime = () => {
      setCurrentTime(video.currentTime);
    };
    
    // video.addEventListener('timeupdate', updateCurrentTime);
    video.ontimeupdate = updateCurrentTime
    
    return () => {
      video.pause();
      video.src = '';
      video.srcObject = null;
      // video.removeEventListener('timeupdate', updateCurrentTime);
      video.ontimeupdate = null;
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

  // const handleLoadedMetadata = () {
  //   if (video) {
  //     console.log(`ビデオの長さ: ${video.duration}秒`)
  //     setDurationInSec(videoRef.current.duration)
  //   } else {
  //     console.error('ビデオのメタデータを取得不能')
  //   }
  // }

  // For Mantine Slider
  // const handleSeekChange = (value: number) => {
  //   const newTime = value;
  //   setCurrentTime(newTime);
  //   if (video) {
  //     video.currentTime = newTime;
  //   }
  // };

  return { videoCurrentTime, handleSeekChange }
};