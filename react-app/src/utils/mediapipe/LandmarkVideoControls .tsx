import { Button, Checkbox } from "@mantine/core";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import React from "react";
import { useLandmarkVideoControl } from "./useLandmarkVideoControl";

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  recordedVideoBlob: Blob;
  isDisplayPosture: boolean;
  videoCurrentTime: number;
  handleSeekChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LandmarkVideoControls: React.FC<VideoControlsProps> = React.memo(({ 
  videoRef,
  recordedVideoBlob,
  videoCurrentTime,
  handleSeekChange,
}) => {

  const {
    isPlaying,
    isLooping,
    togglePlayPause,
    toggleLooping,
  } = useLandmarkVideoControl({videoRef, videoBlob: recordedVideoBlob});

  if (!videoRef.current || videoRef.current.HAVE_NOTHING) {
    return null;
  }

  return (
    <div className="border p-5 my-5">
      <input
        type="range"
        min="0"
        max={videoRef.current.duration || 0}
        value={videoCurrentTime}
        onChange={handleSeekChange}
        style={{ width: '100%' }}
      />
      <div className="flex flex-wrap justify-between">
        <div className="video-control flex gap-2">
          <Button
            onClick={togglePlayPause}
            color="blue"
            variant={isPlaying ? 'outline' : 'filled'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <CiPause1 size={20} /> : <CiPlay1 size={20} />}
          </Button>
          <p>{ Math.trunc(videoCurrentTime) }</p>
          <Checkbox
            label="ループ"
            checked={isLooping}
            onChange={toggleLooping}
            color="blue"
          />
        </div>
      </div>
    </div>
  )
});

LandmarkVideoControls.displayName = 'VideoControls';