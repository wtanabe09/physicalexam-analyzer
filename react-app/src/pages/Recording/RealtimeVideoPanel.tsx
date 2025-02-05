import { Title } from "@mantine/core";
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
  useVideoSource(realtimeVideoRef.current, stream);
  
  return (
    <div className="container p-3">
      <div><Title order={2} className="font-semibold" mb={3}>リアルタイム</Title></div>
      <video
        id="input_stream" ref={realtimeVideoRef}
        width={FRAMESIZE.VIDEO.WIDTH} height={FRAMESIZE.VIDEO.WIDTH}
        muted style={{ display: "none" }}
      />
      <div className="flex flex-wrap gap-4">
        <div>
          <Title order={3} className="font-semibold mb-2">(1) 横カメラ</Title>
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
        </div>
        <div>
          <Title order={3} className="font-semibold mb-2">(2) 上カメラ</Title>
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
        </div>
        <div>
          <Title order={3} className="font-semibold mb-2">(3) 患者カメラ</Title>
          <LandmarkVideoRealtime
            landmarkType='hand_patient_camera'
            videoRef={realtimeVideoRef}
            width={canvasSize.width}
            height={canvasSize.height}
            isRecording={isRecording}
            landmarksToParent={setHandLandmarkChunkForHeatmap}
            isDisplayPosture={isDisplayPosture}
            clipRegion={CameraRegions.Front}
          />
        </div>
      </div>
    </div>
  )
}