import { Box, Group, Title } from "@mantine/core";
import { CameraRegions, FRAMESIZE } from "../../exports/consts";
import { LandmarkChunk } from "../../exports/types";
import { useRef } from "react";
import { LandmarkVideoRealtime } from "../../utils/mediapipe/LandmarkVideoRealtime";
import { useVideoSource } from "../../utils/video/useVideoSource";

const canvasSize = {
  width: FRAMESIZE.CANVAS.WIDTH,
  height: FRAMESIZE.CANVAS.HEIGHT,
}

interface VideoPanelProps {
  stream: MediaStream | null;
  isRecording: boolean;
  isDisplayPosture: boolean;
  setPoseLandmarkChunk: React.Dispatch<React.SetStateAction<LandmarkChunk>>;
  setHandLandmarkChunk: React.Dispatch<React.SetStateAction<LandmarkChunk>>;
  setHandLandmarkChunkForHeatmap: React.Dispatch<React.SetStateAction<LandmarkChunk>>;
}

export const RealtimeVideoPanel: React.FC<VideoPanelProps> = ({
  stream, isRecording, isDisplayPosture,
  setPoseLandmarkChunk, setHandLandmarkChunk, setHandLandmarkChunkForHeatmap
}) => {
  const realtimeVideoRef = useRef<HTMLVideoElement>(null);
  useVideoSource(realtimeVideoRef, stream);
  
  return (
    <Box>
      <Title order={2} className="font-semibold" mb={3}>リアルタイム</Title>
      <video
        id="input_stream" ref={realtimeVideoRef}
        width={FRAMESIZE.VIDEO.WIDTH} height={FRAMESIZE.VIDEO.WIDTH}
        muted style={{ display: "none" }}
      />
      <Group>
        <Box>
          <Title order={3} className="font-semibold">(1) 横カメラ</Title>
          <LandmarkVideoRealtime
            landmarkType='pose'
            videoRef={realtimeVideoRef}
            width={canvasSize.width}
            height={canvasSize.height}
            isRecording={isRecording}
            landmarksToParent={setPoseLandmarkChunk}
            isDisplayPosture={isDisplayPosture}
            clipRegion={CameraRegions.Side}
          />
        </Box>
        <Box>
          <Title order={3} className="font-semibold">(2) 上カメラ</Title>
          <LandmarkVideoRealtime
            landmarkType='hand'
            videoRef={realtimeVideoRef}
            width={canvasSize.width}
            height={canvasSize.height}
            isRecording={isRecording}
            landmarksToParent={setHandLandmarkChunk}
            isDisplayPosture={isDisplayPosture}
            clipRegion={CameraRegions.Top}
          />
        </Box>
        <Box>
          <Title order={3} className="font-semibold">(3) 患者カメラ</Title>
          <LandmarkVideoRealtime
            landmarkType='hand-front'
            videoRef={realtimeVideoRef}
            width={canvasSize.width}
            height={canvasSize.height}
            isRecording={isRecording}
            landmarksToParent={setHandLandmarkChunkForHeatmap}
            isDisplayPosture={isDisplayPosture}
            clipRegion={CameraRegions.Front}
          />
        </Box>
      </Group>
    </Box>
  )
}