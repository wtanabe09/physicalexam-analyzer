import { Title } from "@mantine/core";
import { CameraRegions, FRAMESIZE } from "../../consts/consts";
import { LandmarkChunk, LoadingStatus } from "../../consts/types";
import { HiddenVideo } from "../../utils/video/HiddenVideo";
import { useEffect, useRef, useState } from "react";
import { LandmarkVideoRealtime } from "../../utils/mediapipe/LandmarkVideoRealtime";
import { useVideoSource } from "../../utils/video/useVideoSource";
import { useNavigate } from "react-router-dom";

const canvasSize = {
  width: FRAMESIZE.CANVAS.WIDTH,
  height: FRAMESIZE.CANVAS.HEIGHT,
}

interface VideoPanelProps {
  stream: MediaStream | null;
  isRecording: boolean;
  recordedVideoBlob: Blob | null;
  loadingStatus: LoadingStatus;
  sessionName: String | null;
  isDisplayPosture: boolean;
}

export const RealtimeVideoPanel: React.FC<VideoPanelProps> = ({
  stream, isRecording,
  recordedVideoBlob, loadingStatus,
  sessionName,
  isDisplayPosture,
}) => {
  const realtimeVideoRef = useRef<HTMLVideoElement>(null);
  useVideoSource(realtimeVideoRef, stream!);

  const [ poseLandmarkChunk, setPoseLandmarkChunk] = useState<LandmarkChunk>([[-1, []]]);
  const [ handLandmarkChunkTopCamera, setHandLandmarkChunk] = useState<LandmarkChunk>([[-1, []]]);
  const [ handLandmarkChunkFrontCamera, setHandLandmarkChunkForHeatmap] = useState<LandmarkChunk>([[-1, []]]);

  const navigate = useNavigate();
  useEffect(() => {
    if(recordedVideoBlob && poseLandmarkChunk.length > 1 && handLandmarkChunkTopCamera.length > 1 && handLandmarkChunkTopCamera.length > 1) {
      navigate("/video", { state: {
        videoBlob: recordedVideoBlob,
        loadingStatus: loadingStatus,
        poseLandmarks: poseLandmarkChunk,
        handLandmarksTopCamera: handLandmarkChunkTopCamera,
        handLandmarksFrontCamera: handLandmarkChunkFrontCamera,
      }});
    }
  }, [loadingStatus, recordedVideoBlob, handLandmarkChunkTopCamera, poseLandmarkChunk, handLandmarkChunkFrontCamera]);

  return (
    <div className="container">
      <Title order={2} className="font-semibold mb-8">リアルタイム</Title>
      <div>
        <HiddenVideo
          ref={realtimeVideoRef}
          width={FRAMESIZE.VIDEO.WIDTH}
          height={FRAMESIZE.VIDEO.HEIGHT}
        />
        <div className="">
          <div className="flex flex-wrap gap-4">
            <div>
              <Title order={3} className="font-semibold mb-2">(1) 横カメラ</Title>
              <LandmarkVideoRealtime
                landmarkType='pose'
                videoRef={realtimeVideoRef}
                width={canvasSize.width}
                height={canvasSize.height}
                isRecording={isRecording}
                videoLoadState={"loaded"}
                landmarksToParent={setPoseLandmarkChunk}
                isDisplayPosture={isDisplayPosture}
                clipRegion={CameraRegions.Side}
                sessionName={sessionName}
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
                videoLoadState={"loaded"}
                landmarksToParent={setHandLandmarkChunk}
                isDisplayPosture={isDisplayPosture}
                clipRegion={CameraRegions.Top}
                sessionName={sessionName}
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
                videoLoadState={"loaded"}
                landmarksToParent={setHandLandmarkChunkForHeatmap}
                isDisplayPosture={isDisplayPosture}
                clipRegion={CameraRegions.Front}
                sessionName={sessionName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}