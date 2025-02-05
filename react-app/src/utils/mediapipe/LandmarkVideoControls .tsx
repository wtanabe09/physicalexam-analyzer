import React from "react";
import { Button, Checkbox, Group, Paper } from "@mantine/core";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { useLandmarkVideoControl } from "./useLandmarkVideoControl";

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoBlob: Blob;
  isDisplayPosture: boolean;
  videoCurrentTime: number;
  handleSeekChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LandmarkVideoControls = ({ videoRef, videoBlob, videoCurrentTime, handleSeekChange }: VideoControlsProps) => {
  const { isPlaying, isLoopingRef, togglePlayPause, toggleLooping} = useLandmarkVideoControl({videoRef, videoBlob});

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // const truncateDecimal = (num: number, digits: number) =>{
  //   const factor = 10 ** digits;
  //   return Math.floor(num * factor) / factor;
  // };

  return (
    <Paper p="lg" shadow="lg" radius="sm" withBorder>
      <input
        type="range" min="0" max={videoRef.current?.duration || 0} step={0.1}
        value={videoCurrentTime} onChange={handleSeekChange} style={{ width: '100%' }}
      />
      {/* <Slider
        min={0} max={videoRef.current?.duration || 10} step={0.1}
        value={truncateDecimal(videoCurrentTime, 2)} onChange={handleSeekChange}
      /> */}
      <Group justify="spase-between">
        <Button
          onClick={togglePlayPause}
          color="blue"
          variant={isPlaying ? 'outline' : 'filled'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          size="compact-md"
        >
          {isPlaying ? <CiPause1 size={20} /> : <CiPlay1 size={20} />}
        </Button>
        <p>{ formatTime(videoCurrentTime) }</p>
        <Checkbox
          label="ループ"
          checked={isLoopingRef.current}
          onChange={toggleLooping}
          color="blue"
        />
      </Group>
    </Paper>
  )
};