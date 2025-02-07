import { Button, Checkbox, Group, Paper, Text } from "@mantine/core";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { techniqueOptions } from "../../exports/consts";
import { useParams } from "react-router-dom";
import { useVideoSource } from "../../utils/video/useVideoSource";

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoBlob: Blob;
  isDisplayPosture: boolean;
  setIsDisplayPosture: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VideoControls = ({
  videoRef, videoBlob, isDisplayPosture, setIsDisplayPosture
}: VideoControlsProps) => {
  const { 
    videoCurrentTime, handleSeekChange, togglePlayPause, toggleLooping,
  } = useVideoSource(videoRef, videoBlob);

  const params = useParams();
  const techniqueId = params.id?.split("-")[0];
  const timestamp = params.id?.split("-")[1];
  const techniqueName = techniqueOptions.find(option => option.value === techniqueId);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Paper p="lg" shadow="lg" radius="sm" withBorder>
      <input
        type="range" min="0" max={videoRef.current?.duration||0} step={0.1}
        value={videoCurrentTime} onChange={handleSeekChange} style={{width: "100%"}}
      />
      <Group justify="spase-between" mb={10}>
        <Button
          onClick={togglePlayPause}
          color="blue"
          variant={videoRef.current?.paused ? 'filled':'outline'}
          aria-label={videoRef.current?.paused ? 'Play':'Pause'}
          size="compact-md"
        >
          {videoRef.current?.paused ? <CiPlay1 size={20} /> : <CiPause1 size={20} />}
        </Button>
        <Text>{ formatTime(videoCurrentTime) }</Text>
        <Checkbox
          label="ループ"
          checked={videoRef.current?.loop}
          onChange={toggleLooping}
          color="blue"
        />
        <Checkbox
          label="骨格マーキング表示"
          checked={isDisplayPosture}
          onChange={(event) => setIsDisplayPosture(event.currentTarget.checked)}
          color="cyan"
        />
      </Group>
      <Group>
        <Text>{timestamp?.replace("T", " ").replace(".mp4", "")}</Text>
        <Text>{techniqueName?.label}</Text>
      </Group>
    </Paper>
  )
};