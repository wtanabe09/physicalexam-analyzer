import { Box, Button, Checkbox, Group, Paper, Text, VisuallyHidden } from "@mantine/core";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { techniqueOptions } from "../../exports/consts";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useState } from "react";

interface VideoControlsProps {
  playerRef: React.RefObject<ReactPlayer>;
  videoUrl: string;
  isDisplayPosture: boolean;
  setIsDisplayPosture: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VideoControls = ({
  playerRef, videoUrl, isDisplayPosture, setIsDisplayPosture
}: VideoControlsProps) => {

  const params = useParams();
  const techniqueId = params.id?.split("-")[0];
  const timestamp = params.id?.split("-")[1];
  const techniqueName = techniqueOptions.find(option => option.value === techniqueId);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // ステート管理
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [isLoop, setIsLoop] = useState(false);

  // 再生 / 一時停止の切り替え
  const togglePlay = () => setPlaying((prev) => !prev);
  const toggleLoop = () => setIsLoop((prev) => !prev);

  // シークバーの変更処理
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setPlayed(newValue);
    playerRef.current?.seekTo(newValue);
  };

  // 音量変更
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleEnded = () => {
    if (!isLoop) {
      setPlaying(false); // 停止
      setPlayed(0); // シークバーをリセット
      playerRef.current?.seekTo(0); // 動画を最初に戻す
    }
  };


  return (
    <Box>
      <VisuallyHidden>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          volume={volume}
          loop={isLoop}
          onProgress={(progress) => setPlayed(progress.playedSeconds)}
          onEnded={handleEnded}
        />
      </VisuallyHidden>
      <Paper p="md" shadow="lg" radius="sm" withBorder>
        <Group justify="space-between">
          <Group>
            <Button
              onClick={togglePlay}
              color="blue"
              variant={playing ? 'outline':'filled'}
              aria-label={playing ? 'Pause':'Play'}
              size="compact-md"
            >
              {playing ? <CiPause1 size={20} />:<CiPlay1 size={20} /> }
            </Button>
            <Text>{ formatTime(played) }</Text>
          </Group>
          <Box w={"50%"}>
            <Group>
              <Text>{timestamp?.replace("T", " / ").replace(".mp4", "")}</Text>
              <Text>{techniqueName?.label}</Text>
            </Group>
            <input
              type="range" min="0" max={playerRef.current?.getSecondsLoaded() || 60} step={0.1}
              value={played} onChange={handleSeekChange} style={{width: "100%"}}
            />
          </Box>
          <Group>
            <Checkbox
              label="ループ"
              checked={isLoop}
              onChange={toggleLoop}
              color="blue"
            />
            <Checkbox
              label="骨格マーキング"
              checked={isDisplayPosture}
              onChange={(event) => setIsDisplayPosture(event.currentTarget.checked)}
              color="cyan"
            />
            <input
              type="range" min="0" max="1" step="0.1"
              value={volume} onChange={handleVolumeChange}
            />
            <Text>音量</Text>
          </Group>
        </Group>
      </Paper>
    </Box>
  )
};